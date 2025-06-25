import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs";
import { UserAuthSchema } from "./app/lib/schema/authSchema";
import {
  findOrCreateUser,
  getUserByEmail,
} from "./app/lib/db/controllers/userController";
import { UserSession } from "./app/lib/definitions";

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

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getUserByEmail(user.email);

        if (dbUser) {
          token.id = dbUser._id;
          token.avatarURL = dbUser.avatarURL;
          token.role = dbUser.role;
          token.groups = dbUser.groups;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.fullName = dbUser.fullName;
        }
      }

      return token;
    },

    // @ts-ignore
    async session({ session, token }: { session: UserSession; token: any }) {
      if (token) {
        session.user = {
          ...session.user,
          ...token
        };
      }
      return session;
    },
  },
});
