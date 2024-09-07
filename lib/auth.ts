import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { db } from "@/lib/db";
import { UserRole } from "@/types/next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

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
    ...(process.env.NODE_ENV === "production"
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              role: { type: "text" },
            },
            async authorize(credentials, req) {
              if (
                !credentials ||
                !["PARENT", "STAFF", "SUPER_STAFF"].includes(credentials.role)
              ) {
                return null;
              }

              const user =
                credentials.role === "STAFF"
                  ? await db.user.findFirst({
                      where: {
                        role: credentials.role,
                      },
                    })
                  : credentials.role === "PARENT"
                  ? await db.user.findFirst({
                      include: {
                        students: true,
                      },
                      where: {
                        role: credentials.role,
                        students: {
                          some: {},
                        },
                      },
                    })
                  : await db.user.findFirst();

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
        ]
      : []),
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

      const dbUser = await db.user.findFirst({
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
