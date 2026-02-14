import z from "zod";

import { fuelTypes, vehicleTypes } from "@/app/lib/types/vehicle";

const VehicleTypeEnum = z.enum(vehicleTypes);

const createBaseVehicleSchema = (t: (key: string, values?: any) => string) => {
  return z.object({
    name: z.string().min(1, {
      message: t("baseRequired"),
    }),
    description: z.string(),
    imageSrc: z.string(),
    group: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    type: VehicleTypeEnum,
  });
};

const createCarSchema = (t: (key: string, values?: any) => string) => {
  return createBaseVehicleSchema(t).extend({
    type: z.literal("car"),
    fuelType: z.enum(fuelTypes, {
      required_error: t("baseRequired"),
      invalid_type_error: t("baseRequired"),
    }),
    odometer: z.number().min(1),
    vinCode: z.string().optional(),
  });
};

const createBicycleSchema = (t: (key: string, values?: any) => string) => {
  return createBaseVehicleSchema(t).extend({
    type: z.literal("bicycle"),
  });
};

export const createVehicleSchema = (
  t: (key: string, values?: any) => string
) => {
  return z.discriminatedUnion("type", [
    createCarSchema(t),
    createBicycleSchema(t),
  ]);
};

export const createFuelRecordSchema = (
  t: (key: string, values?: any) => string,
  currentVehicleOdometer: number,
  isEdit: boolean
) => {
  return z
    .object({
      odometer: z.number().min(1, {
        message: t("baseRequired"),
      }),

      liters: z.number().min(1, {
        message: t("baseRequired"),
      }),

      amount: z.number().min(1, {
        message: t("baseRequired"),
      }),

      fullTank: z.boolean(),

      city: z.string().max(100),

      notes: z.string().max(255),

      createdAt: z.string(),

      trip: z.number(),

      isMissed: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (!data.isMissed) {
        if (data.odometer < currentVehicleOdometer && !isEdit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["odometer"],
            message: t("odomLessThanCurrent"),
          });
        }

        if (!data.trip || data.trip < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["trip"],
            message: t("baseRequired"),
          });
        }
      }

      if (data.isMissed) {
      }
    });
};
