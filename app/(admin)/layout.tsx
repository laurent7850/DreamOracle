import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAdminUser } from "@/lib/admin";
import { AuthProvider } from "@/lib/auth-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/dashboard");
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    </AuthProvider>
  );
}
