import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '../../../server/db/client';
import { env } from "../../../env/server.mjs";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {

  callbacks: {

  session({ session, user }) {

      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      const { locale } = profile
      const { email } = user

      const etablissement = await prisma.etablissement.findFirst({
        where: {
          membresAutorises: {
            has: email
          }
        },
        select: {
          id: true,
          membres: {
            select: {
              email: true
            }
          }
        },
      })
      ///
      if (etablissement && email) {
        if (!etablissement.membres.map((m)=>m.email).includes(email)) {
          await prisma.utilisateur.create({
            data: {
             locale:locale as string,
              etablissementId: etablissement.id,
              email
            }
          })
        }
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: "/",
    error: '/state/error/auth',
  }
};

export default NextAuth(authOptions);
