import { Session } from "next-auth";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarURL: string | null;
  groups: Group[];
};

export type PublicUser = Pick<
  User,
  "firstName" | "lastName" | "email" | "avatarURL"
>;

export type UserSession = Session & {
  user: PublicUser & { id: string };
};

export type Group = {
  _id: string;
  name: string;
};
