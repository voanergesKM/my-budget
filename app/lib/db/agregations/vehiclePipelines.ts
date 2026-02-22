import mongoose, { PipelineStage } from "mongoose";

export function buildVehicleFuelRecordStatsPipeline(
  vehicleId: string
): PipelineStage[] {
  const vehicleObjectId = new mongoose.Types.ObjectId(vehicleId);

  return [
    {
      $match: {
        vehicle: vehicleObjectId,
      },
    },

    {
      $project: {
        odometer: 1,
        liters: 1,
        amount: 1,
        consumption: 1,
        fullTank: 1,
        isMissed: 1,
        trip: 1,
        currency: 1,
        createdAt: 1,
      },
    },

    {
      $addFields: {
        pricePerLiter: {
          $cond: [
            { $gt: ["$liters", 0] },
            { $divide: ["$amount", "$liters"] },
            null,
          ],
        },
        costPerKm: {
          $cond: [
            { $gt: ["$trip", 0] },
            { $divide: ["$amount", "$trip"] },
            null,
          ],
        },
      },
    },

    {
      $facet: {
        consumption: [
          {
            $match: {
              consumption: { $gt: 0 },
              fullTank: true,
              isMissed: { $ne: true },
            },
          },
          { $sort: { odometer: -1 } },
          {
            $group: {
              _id: null,
              min: { $min: "$consumption" },
              avg: { $avg: "$consumption" },
              max: { $max: "$consumption" },
              count: { $sum: 1 },
              last: { $first: "$consumption" },
              lastAt: { $first: "$createdAt" },
              stdDev: { $stdDevPop: "$consumption" },
            },
          },
        ],

        pricePerLiter: [
          { $match: { pricePerLiter: { $ne: null } } },
          { $sort: { odometer: -1 } },
          {
            $group: {
              _id: null,
              min: { $min: "$pricePerLiter" },
              avg: { $avg: "$pricePerLiter" },
              max: { $max: "$pricePerLiter" },
              count: { $sum: 1 },
              last: { $first: "$pricePerLiter" },
              currency: { $first: "$currency" },
            },
          },
        ],

        refuelCost: [
          {
            $group: {
              _id: null,
              avg: { $avg: "$amount" },
              min: { $min: "$amount" },
              max: { $max: "$amount" },
              currency: { $first: "$currency" },
            },
          },
        ],

        costPerKm: [
          {
            $match: {
              fullTank: true,
              isMissed: { $ne: true },
              trip: { $exists: true, $gt: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              totalTrip: { $sum: "$trip" },
              min: { $min: "$costPerKm" },
              max: { $max: "$costPerKm" },
              count: { $sum: 1 },
              currency: { $first: "$currency" },
            },
          },
          {
            $addFields: {
              avg: {
                $cond: [
                  { $gt: ["$totalTrip", 0] },
                  { $divide: ["$totalAmount", "$totalTrip"] },
                  null,
                ],
              },
            },
          },
        ],

        lastFullTank: [
          {
            $match: {
              fullTank: true,
              isMissed: { $ne: true },
            },
          },
          {
            $sort: { odometer: -1 },
          },
          {
            $limit: 1,
          },
          {
            $addFields: {
              pricePerLiter: {
                $cond: [
                  { $gt: ["$liters", 0] },
                  { $divide: ["$amount", "$liters"] },
                  null,
                ],
              },
            },
          },
          {
            $project: {
              amount: 1,
              currency: 1,
              consumption: 1,
              trip: 1,
              odometer: 1,
              createdAt: 1,
              transaction: 1,
              pricePerLiter: 1,
            },
          },
        ],

        totals: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              totalLiters: { $sum: "$liters" },
              totalTrip: { $sum: "$trip" },
              totalRecords: { $sum: 1 },
              currency: { $first: "$currency" },
            },
          },
        ],

        timeline: [
          {
            $group: {
              _id: null,
              firstRecordAt: { $min: "$createdAt" },
              lastRecordAt: { $max: "$createdAt" },
            },
          },
        ],
      },
    },

    {
      $project: {
        lastFullTank: { $arrayElemAt: ["$lastFullTank", 0] },
        totals: { $arrayElemAt: ["$totals", 0] },
        consumption: { $arrayElemAt: ["$consumption", 0] },
        pricePerLiter: { $arrayElemAt: ["$pricePerLiter", 0] },
        refuelCost: { $arrayElemAt: ["$refuelCost", 0] },
        costPerKm: { $arrayElemAt: ["$costPerKm", 0] },
        timeline: { $arrayElemAt: ["$timeline", 0] },
      },
    },
  ];
}

export const buildVehicleExpensesPipeline = (
  vehicleId: string
): PipelineStage[] => {
  const objectId = new mongoose.Types.ObjectId(vehicleId);

  return [
    {
      $match: {
        vehicle: objectId,
      },
    },

    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
              avgAmount: { $avg: "$amount" },
              minAmount: { $min: "$amount" },
              maxAmount: { $max: "$amount" },
              currency: { $first: "$currency" },
            },
          },
        ],

        byCategory: [
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ],

        lastRecord: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $project: {
              _id: 1,
              title: 1,
              amount: 1,
              category: 1,
              createdAt: 1,
              odometer: 1,
              currency: 1,
            },
          },
        ],
      },
    },

    {
      $project: {
        summary: { $arrayElemAt: ["$summary", 0] },
        byCategory: 1,
        lastRecord: { $arrayElemAt: ["$lastRecord", 0] },
      },
    },

    {
      $addFields: {
        breakdown: {
          $arrayToObject: {
            $map: {
              input: "$byCategory",
              as: "cat",
              in: {
                k: "$$cat._id",
                v: "$$cat.total",
              },
            },
          },
        },

        topCategory: {
          $let: {
            vars: { first: { $arrayElemAt: ["$byCategory", 0] } },
            in: "$$first._id",
          },
        },
      },
    },
  ];
};
