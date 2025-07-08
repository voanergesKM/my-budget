import { Session } from "next-auth";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarURL: string | null;
  groups: Group[];
  fullName?: string;
};

export type PublicUser = Pick<User, "firstName" | "lastName" | "email" | "avatarURL">;

export type UserSession = Session & {
  user: PublicUser & { id: string };
};

export type Group = {
  _id: string;
  name: string;
};

export type ShoppingItem = {
  id?: string;
  title: string;
  completed?: boolean;
  quantity?: number | null;
  unit: string;
  notes?: string;
  position?: number;
};

export type Shopping = {
  _id: string;
  title: string;
  items: ShoppingItem[];
  completed?: boolean;
  archived?: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  createdBy: User;
  group?: Group;
};

export const enum ShoppingItemUnit {
  Pcs = 1,
  Kg,
  L,
  Ml,
  G,
  Each,
}
