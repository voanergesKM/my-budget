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

export const createServiceRecordSchema = (
  t: (key: string, values?: any) => string,
  currentVehicleOdometer: number,
  _isEdit: boolean
) => {
  return z
    .object({
      title: z.string().min(1, {
        message: t("baseRequired"),
      }),
      category: z.string().min(1, {
        message: t("categoryRequired"),
      }),
      amount: z.number().min(1, {
        message: t("baseRequired"),
      }),
      odometer: z.number(),
      createdAt: z.string(),
      notes: z.string().max(255),

      remind: z.boolean(),
      reminderMode: z.string(),

      remindAtDate: z.string(),
      remindAtOdometer: z.number(),
      month: z.number(),
      trip: z.number(),
    })
    .superRefine((data, ctx) => {
      if (!data.remind) return;

      const hasDate = !!data.remindAtDate;
      const hasOdo = data.remindAtOdometer > 0;

      if (
        !!data.remindAtOdometer &&
        data.remindAtOdometer <= currentVehicleOdometer
      ) {
        const path =
          data.reminderMode === "relative" ? "trip" : "remindAtOdometer";

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [path],
          message: t("odomLessThanCurrent"),
        });
      }

      if (data.reminderMode === "relative") {
        if (!data.odometer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["odometer"],
            message: t("baseRequired"),
          });
        }

        if (!data.month && !data.trip) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["month"],
            message: t("baseRequired"),
          });

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["trip"],
            message: t("baseRequired"),
          });
        }
      }

      if (data.reminderMode === "exact") {
        if (!hasDate && !hasOdo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["remindAtDate"],
            message: t("baseRequired"),
          });

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["remindAtOdometer"],
            message: t("baseRequired"),
          });
        }
      }
    });
};

export const createScheduleRecordSchema = (
  t: (key: string, values?: any) => string,
  currentVehicleOdometer: number,
  isEdit: boolean
) => {
  return z
    .object({
      title: z.string().min(1, {
        message: t("baseRequired"),
      }),
      category: z.string().min(1, {
        message: t("categoryRequired"),
      }),
      status: z.string(),
      triggerDate: z.string(),
      triggerOdometer: z.number(),
      recordTriggerOdometer: z.number().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      const { recordTriggerOdometer, triggerOdometer } = data;

      if (
        isEdit &&
        recordTriggerOdometer !== triggerOdometer &&
        triggerOdometer < currentVehicleOdometer
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["triggerOdometer"],
          message: t("odomLessThanCurrent"),
        });
      }

      if (
        !isEdit &&
        data.triggerOdometer &&
        data.triggerOdometer < currentVehicleOdometer
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["triggerOdometer"],
          message: t("odomLessThanCurrent"),
        });
      }

      if (!data.triggerDate && !data.triggerOdometer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["triggerDate"],
          message: t("baseRequired"),
        });

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["triggerOdometer"],
          message: t("baseRequired"),
        });
      }
    });
};
