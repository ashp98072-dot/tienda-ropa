import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/cuenta");

  return (
    <div className="mx-auto max-w-lg px-4 pt-28 pb-16">
      <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl">
        Entrar
      </h1>
      <LoginForm />
    </div>
  );
}
