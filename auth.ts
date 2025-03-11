import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { getUser } from "@/app/lib/actions/auth";
import { addUser, requestUser, updateUser } from "./app/lib/db/auth";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );
          if (passwordsMatch) return user;
        }

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
        const { email, name, image } = user;

        let existingUser = await requestUser(email as string);

        if (!existingUser || existingUser.length === 0) {
          // add the User to the database
          await addUser(email as string, "", name as string, image as string);
        } else {
          // update the User
          await updateUser(email as string, image as string, name as string);
        }
        return true;
      }
      return true;
    },

    async jwt({ token }) {
      const { email } = token;
      const existingUser = await requestUser(email as string);
      token.currentUser = existingUser[0];
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.currentUser.id as string;
      session.user.isAdmin = token.currentUser.isAdmin as string;
      session.user.groupdIds = token.currentUser.groupIds as number[];
      return session;
    },
  },
});
