import { AuthProvider } from "@/lib/auth-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
