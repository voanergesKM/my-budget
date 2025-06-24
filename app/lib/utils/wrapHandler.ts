import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
} from "../errors/customErrors";

export function wrapHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return NextResponse.json(
          { success: false, message: error.message },
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
          { success: false, message: "Not authorized" },
          { status: 401 }
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
            message: "Validation failed",
            errors,
          },
          { status: 400 }
        );
      }

      if (error instanceof mongoose.Error.CastError) {
        return NextResponse.json(
          { success: false, message: "Invalid ID format" },
          { status: 400 }
        );
      }

      console.error("⛔ Unexpected error:", error);
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }
  };
}
