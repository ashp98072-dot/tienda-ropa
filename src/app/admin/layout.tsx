import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAdminAuthenticated();

  return (
    <div className="min-h-screen">
      {authed && <AdminNav />}
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
