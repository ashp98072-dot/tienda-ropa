"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function DemoPaymentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const [loading, setLoading] = useState(false);

  async function finish(result: "success" | "fail") {
    if (!orderId) return;
    setLoading(true);
    const res = await fetch("/api/payments/qpaypro/demo-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, result }),
    });
    const data = (await res.json()) as { redirectUrl?: string };
    if (data.redirectUrl) {
      router.push(data.redirectUrl.replace(/^https?:\/\/[^/]+/, ""));
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-24">
      <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
        QPayPro · Sandbox demo
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
        Simular pago
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Pedido <span className="text-[var(--ink)]">{orderId || "—"}</span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
        Este paso aparece cuando{" "}
        <code className="text-[var(--ink)]">QPAYPRO_DEMO_MODE=true</code> o no
        hay credenciales. Con credenciales reales irás a QPayPro hosted
        checkout.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          disabled={loading || !orderId}
          onClick={() => finish("success")}
          className="bg-[var(--ink)] px-4 py-3.5 text-xs tracking-[0.2em] text-white uppercase disabled:opacity-50"
        >
          Simular pago exitoso
        </button>
        <button
          type="button"
          disabled={loading || !orderId}
          onClick={() => finish("fail")}
          className="border border-[var(--ink)]/20 px-4 py-3.5 text-xs tracking-[0.2em] uppercase disabled:opacity-50"
        >
          Simular rechazo
        </button>
      </div>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-32 text-center text-sm text-[var(--muted)]">
          Cargando…
        </div>
      }
    >
      <DemoPaymentInner />
    </Suspense>
  );
}
