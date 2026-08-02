import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";

import {
  findOrCreateUser,
  getUserByEmail,
} from "./app/lib/db/controllers/userController";
import { UserSession } from "./app/lib/definitions";
import { UserAuthSchema } from "./app/lib/schema/authSchema";
import { authConfig } from "./auth.config";

function serializeUserToken(dbUser: any) {
  const groups = Array.isArray(dbUser.groups) ? dbUser.groups : [];

  return {
    id: dbUser._id.toString(),
    email: dbUser.email,
    avatarURL: dbUser.avatarURL ?? null,
    role: dbUser.role,
    groups: Array.from(groups, (group: any) => group.toString()),
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    fullName: [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" "),
    defaultCurrency: dbUser.defaultCurrency ?? "USD",
    colorScheme: dbUser.colorScheme ?? "default",
    createdAt: dbUser.createdAt?.toISOString(),
    updatedAt: dbUser.updatedAt?.toISOString(),
  };
}

function buildAuthToken(dbUser: any) {
  const userToken = serializeUserToken(dbUser);

  return JSON.parse(
    JSON.stringify({
      ...userToken,
      name: userToken.fullName,
      picture: userToken.avatarURL,
      sub: userToken.id,
    })
  );
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = UserAuthSchema.safeParse(credentials);

        if (!parsed.success) {
          console.warn(
            "Invalid credentials:",
            parsed.error.flatten().fieldErrors
          );
          return null;
        }

        const { email, password } = parsed.data;

        const user = await getUserByEmail(email);

        if (!user) return null;

        const passwordsMatch = await bcryptjs.compare(password, user.password);

        if (passwordsMatch) return buildAuthToken(user);

        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email, name, image } = user as {
          email: string;
          name: string;
          image: string;
        };

        const [firstName = "", ...lastNameParts] = (name ?? "").split(" ");

        await findOrCreateUser({
          email,
          firstName,
          lastName: lastNameParts.join(" "),
          avatarURL: image,
        });

        return true;
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      const email =
        trigger === "update"
          ? session?.email || session?.user?.email || token?.email
          : user?.email || token?.email;

      if (token || user || trigger === "update") {
        if (!email) return token;

        const dbUser = await getUserByEmail(email);
        if (!dbUser) return token;

        return buildAuthToken(dbUser);
      }

      return token;
    },

    // @ts-ignore
    async session({ session, token }: { session: UserSession; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        };
      }
      return session;
    },
  },
});
