import { addMonthsSafe, getNextAnnualDate } from "./dateUtils";

export const getNextProceedDate = (date: Date, frequency: string): Date => {
  switch (frequency) {
    case "daily":
      date.setUTCDate(date.getUTCDate() + 1);
      return date;

    case "weekly":
      date.setUTCDate(date.getUTCDate() + 7);
      return date;

    case "2weeks":
      date.setUTCDate(date.getUTCDate() + 14);
      return date;

    case "4weeks":
      date.setUTCDate(date.getUTCDate() + 28);
      return date;

    case "monthly":
      return addMonthsSafe(date, 1);

    case "annually":
      return getNextAnnualDate(date);

    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
};
