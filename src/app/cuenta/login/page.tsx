import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNextPath } from "@/lib/auth-redirect";
import { getSessionUser } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pick(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const next = safeNextPath(pick(sp.next));
  const user = await getSessionUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-lg px-4 pt-28 pb-16">
      <h1 className="mb-8 text-center font-[family-name:var(--font-display)] text-4xl">
        Entrar
      </h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
