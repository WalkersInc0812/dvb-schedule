import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

import { db } from "@/lib/db";
import { UserRole } from "@/types/next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import jwt from "jsonwebtoken";
import { sendVerificationRequest } from "./resend";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { type: "text" },
        role: { type: "text" },
        name: { type: "text" },
      },
      async authorize(credentials, req) {
        if (
          !credentials ||
          !credentials.id ||
          !["PARENT", "STAFF", "SUPER_STAFF"].includes(credentials.role)
        ) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            id: credentials.id,
          },
        });

        if (user) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            process.env.NEXTAUTH_SECRET!
          );

          return { ...user, token };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.email) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      // token.emailの大文字小文字を区別しない処理を正規表現により入れる

      const dbUser = await db.user.findFirst({
        where: {
          email: {
            equals: token.email,
            mode: "insensitive",
          },
          deletedAt: null, // TODO: 動作確認
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role as UserRole,
      };
    },
  },
};
