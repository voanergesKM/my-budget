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
    reminderSettings: z.object({
      default: reminderSettingsSchema(t),
    }),
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

const reminderSettingsSchema = (t: (key: string) => string) =>
  z
    .object({
      dateGapDays: z.number(),
      odometerGapKm: z.number(),
    })
    .superRefine((data, ctx) => {
      if (!data.dateGapDays && !data.odometerGapKm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateGapDays"],
          message: t("baseRequired"),
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["odometerGapKm"],
          message: t("baseRequired"),
        });
      }
    });
