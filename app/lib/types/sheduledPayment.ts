import { Category, Group, PublicUser } from "../definitions";

export type ScheduledPaymentType = {
  _id: string;
  createdBy: PublicUser;
  group: Group;

  description: string;
  amount: number;
  currency: string;
  category: Category | string;
  proceedDate: Date;
  skipNext: boolean;

  frequency: "daily" | "weekly" | "2weeks" | "4weeks" | "monthly" | "annually";
  status: "active" | "paused" | "cancelled";

  createdAt: string;
  updatedAt: string;
};
