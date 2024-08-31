import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { db } from "@/lib/db";
import { UserRole } from "@/types/next-auth";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      console.log(token);

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

      const dbUser =
        process.env.NODE_ENV !== "production" &&
        process.env.LOGIN_AS === "STAFF"
          ? await db.user.findFirst({
              where: {
                role: process.env.LOGIN_AS,
              },
            })
          : process.env.NODE_ENV !== "production" &&
            process.env.LOGIN_AS === "PARENT"
          ? await db.user.findFirst({
              include: {
                students: true,
              },
              where: {
                role: process.env.LOGIN_AS,
                students: {
                  some: {},
                },
              },
            })
          : await db.user.findFirst({
              where: {
                email: token.email,
              },
            });

      console.log(dbUser);
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
