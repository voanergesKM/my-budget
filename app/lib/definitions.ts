import { Session } from "next-auth";

import { CategoryIconKey } from "../ui/icons/categories";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarURL: string | null;
  groups: Group[];
  fullName?: string;
  role: string;
  defaultCurrency: string;
};

export type PublicUser = Pick<
  User,
  "firstName" | "lastName" | "email" | "avatarURL" | "defaultCurrency"
>;

export type UserSession = Session & {
  user: PublicUser & {
    id: string;
    role: string;
    groups: string[] | Group[];
  };
};

export type Group = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
  members?: User[];
  pendingMembers: PendingMember[];
  totalMembers?: number;
  defaultCurrency: string;
};

export type PendingMember = {
  _id?: string;
  email: string;
  status?: string;
  token?: string;
  invitedBy?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ShoppingItem = {
  id: string;
  title: string;
  completed: boolean;
  quantity: number;
  unit: string;
  category: string;
  amount: number;
};

export type Shopping = {
  _id: string;
  title: string;
  items: ShoppingItem[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  group?: Group;
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  icon: CategoryIconKey;
  color: string;
  type: "incoming" | "outgoing";
  group: Group;
  createdBy: User;
  includeInAnalytics: boolean;
};

export type CategoryStat = {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  currency: string;
  total: number;
  amountInBaseCurrency: number;
};

export type Transaction = {
  _id: string;
  transientId?: string;
  description: string;
  amount: number;
  type: "incoming" | "outgoing";
  currency: string;
  createdAt: string;
  updatedAt: string;
  category: Category | string;
  group: Group;
  createdBy: User;
  amountInBaseCurrency: number;
};

export type PaginatedResponse<T> = {
  list: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
};

export type ExchangeRate = {
  base: string;
  rates: { [key: string]: number };
  date: string;
};

export type ScanedItem = {
  name: string;
  price: number;
  quantity: number;
  total: number;
  category: string;
  discount: number;
};

export type RecipeScan = {
  date: string;
  store: string;
  currency: string;
  items: ScanedItem[];
};

type CurrencyValue = {
  total: number;
  amountInBaseCurrency: number;
};

type MonthlyData = {
  [key: string]: CurrencyValue | { month: string };
};

export interface SummaryByMonth extends Array<MonthlyData> {}
