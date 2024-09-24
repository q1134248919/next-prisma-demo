import NextAuth, { AuthError } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma/prisma";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  providers: [
    github,
    google,
    CredentialsProvider({
      name: "Sign in",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
        code: { label: "code", type: "string" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },
        });

        if (
          !user ||
          !(await bcrypt.compare(
            String(credentials.password),
            user.password || ""
          ))
        ) {
          throw new AuthError("賬號密碼錯誤");
        }

        const codeVal = await prisma.verificationRequest.findUnique({
          where: {
            email: credentials?.email as string,
          },
        });
        const { code = "", expires } = codeVal || {};

        if (!(await bcrypt.compare(String(credentials.code), code))) {
          return null;
        }
        if (expires && expires < new Date()) {
          throw new Error("验证码已经过期");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: "Hey cool",
        };
      },
    }),
  ],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/", "/login", "/register"];

      if (isLoggedIn && nextUrl.pathname == "/login") {
        return Response.redirect(new URL("/profile", nextUrl));
      }

      if (!isLoggedIn && !paths.includes(nextUrl.pathname)) {
        const redirectUrl = new URL("/login", nextUrl.origin);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
    session(params) {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          randomKey: params.token.randomKey,
        },
      };
    },
  },
});

export const { handlers, auth, signIn, signOut } = authConfig;
