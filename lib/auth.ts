import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { sendNewRegistrationEmail } from "./email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  // Allow requests from local network IP
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Utilisateur non trouvé");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user }) {
      if (user.id) {
        try {
          // Check if this is a new Google OAuth user → activate Oracle+ trial
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { createdAt: true, trialUsed: true },
          });

          if (dbUser) {
            const isNewUser = (Date.now() - dbUser.createdAt.getTime()) < 60000 && !dbUser.trialUsed;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                lastLoginAt: new Date(),
                // Essai Oracle+ 7 jours pour les nouveaux inscrits Google
                ...(isNewUser ? {
                  subscriptionTier: "PREMIUM",
                  trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  trialUsed: true,
                } : {}),
              },
            });

            // Notify admin of new Google OAuth registration (fire-and-forget)
            if (isNewUser) {
              sendNewRegistrationEmail(user.name || null, user.email!, 'Google OAuth').catch(() => {});
            }
          }
        } catch {
          // Ignore errors (e.g., field doesn't exist yet)
        }
      }
      return true;
    },
  },
});

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
