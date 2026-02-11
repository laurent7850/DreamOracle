// Admin utilities
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_EMAILS = [
  "divers@distr-action.com",
];

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;

  // Check if email is in admin list OR user has admin role
  if (ADMIN_EMAILS.includes(session.user.email)) return true;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  return user?.role === "admin";
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getAdminUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const isAdminUser = ADMIN_EMAILS.includes(session.user.email);

  if (!isAdminUser) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });
    if (user?.role !== "admin") return null;
  }

  return session.user;
}
