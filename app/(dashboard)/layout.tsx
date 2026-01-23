import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthProvider } from "@/lib/auth-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { StarField } from "@/components/shared/StarField";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <StarField count={80} />

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="relative z-10 pt-16 pb-20 md:pb-6 md:pl-64">
          <div className="p-6">{children}</div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </AuthProvider>
  );
}
