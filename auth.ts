import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";

import { findOrCreateUser, getUserByEmail } from "./app/lib/db/controllers/userController";
import { UserSession } from "./app/lib/definitions";
import { UserAuthSchema } from "./app/lib/schema/authSchema";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = UserAuthSchema.safeParse(credentials);

        if (!parsed.success) {
          console.warn("Invalid credentials:", parsed.error.flatten().fieldErrors);
          return null;
        }

        const { email, password } = parsed.data;

        const user = await getUserByEmail(email);

        if (!user) return null;

        const passwordsMatch = await bcryptjs.compare(password, user.password);

        if (passwordsMatch) return user;

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

        const [firstName, lastName] = name.split(" ");

        await findOrCreateUser({
          email,
          firstName,
          lastName,
          avatarURL: image,
        });

        return true;
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      const email = user?.email || (trigger === "update" ? session?.email : null);

      if (!email) return token;

      const dbUser = await getUserByEmail(email);
      if (!dbUser) return token;

      return {
        ...token,
        id: dbUser._id,
        avatarURL: dbUser.avatarURL,
        role: dbUser.role,
        groups: dbUser.groups,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        fullName: dbUser.fullName,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      };
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


