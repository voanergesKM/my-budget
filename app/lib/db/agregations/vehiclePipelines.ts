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
      $addFields: {
        pricePerLiter: {
          $cond: [
            { $eq: ["$liters", 0] },
            null,
            { $divide: ["$amount", "$liters"] },
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
          {
            $group: {
              _id: null,
              avgConsumption: { $avg: "$consumption" },
              minConsumption: { $min: "$consumption" },
              maxConsumption: { $max: "$consumption" },
              consumptionCount: { $sum: 1 },
              lastConsumptionAt: { $max: "$createdAt" },
              lastConsumption: { $first: "$consumption" },
            },
          },
        ],

        finance: [
          {
            $group: {
              _id: null,

              totalAmount: { $sum: "$amount" },
              totalLiters: { $sum: "$liters" },

              avgPricePerLiter: { $avg: "$pricePerLiter" },
              bestPricePerLiter: { $min: "$pricePerLiter" },
              worstPricePerLiter: { $max: "$pricePerLiter" },
            },
          },
        ],

        records: [
          {
            $group: {
              _id: null,
              totalRecords: { $sum: 1 },
              fullTankCount: {
                $sum: { $cond: ["$fullTank", 1, 0] },
              },
              missedCount: {
                $sum: { $cond: ["$isMissed", 1, 0] },
              },
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
        consumption: { $arrayElemAt: ["$consumption", 0] },
        finance: { $arrayElemAt: ["$finance", 0] },
        records: { $arrayElemAt: ["$records", 0] },
        timeline: { $arrayElemAt: ["$timeline", 0] },
      },
    },
  ];
}
