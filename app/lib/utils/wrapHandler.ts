import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import {
  ForbiddenError,
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/customErrors";

import { withServerTranslations } from "./withServerTranslations";

export function wrapHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const t = await withServerTranslations("Notifications");

    try {
      return await handler(req);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return NextResponse.json(
          { success: false, message: error.message || t("notFound") },
          { status: 404 }
        );
      }

      if (error instanceof ValidationError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 400 }
        );
      }

      if (error instanceof NotAuthorizedError) {
        return NextResponse.json(
          { success: false, message: error.message || t("notAuthorized") },
          { status: 401 }
        );
      }

      if (error instanceof ForbiddenError) {
        return NextResponse.json(
          { success: false, message: error.message || t("forbidden") },
          { status: 403 }
        );
      }

      if (error instanceof mongoose.Error.ValidationError) {
        const errors = Object.entries(error.errors).map(
          ([field, err]: [string, any]) => ({
            field,
            message: err.message,
          })
        );

        return NextResponse.json(
          {
            success: false,
            message: t("mongoValidationError"),
            errors,
          },
          { status: 400 }
        );
      }

      if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json(
          { success: false, message: t("mongoCastError") },
          { status: 400 }
        );
      }

      console.error("⛔ Unexpected error:", error);
      return NextResponse.json(
        { success: false, message: t("serverError") },
        { status: 500 }
      );
    }
  };
}
