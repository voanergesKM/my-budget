import { Session } from "next-auth";

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatarURL: string | null;
};

export type PublicUser = Pick<User, "name" | "email" | "avatarURL">;

export type UserSession = Session & {
  user: PublicUser & { id: string };
};
