"use client";

import { useEffect, useState, type FormEvent } from "react";
import { DEPARTMENTS_GT } from "@/lib/products";
import type { Address } from "@/lib/addresses";
import { createClient } from "@/lib/supabase-browser";

const empty = {
  label: "Casa",
  full_name: "",
  phone: "",
  department: "Guatemala",
  municipality: "",
  address: "",
  notes: "",
  is_default: true,
};

export function AddressesManager({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setAddresses((data as Address[]) ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();

    if (form.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    if (editingId) {
      const { error: err } = await supabase
        .from("addresses")
        .update(form)
        .eq("id", editingId)
        .eq("user_id", userId);
      if (err) {
        setError(err.message);
        return;
      }
    } else {
      const { error: err } = await supabase.from("addresses").insert({
        ...form,
        user_id: userId,
      });
      if (err) {
        setError(err.message);
        return;
      }
    }

    setForm(empty);
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const supabase = createClient();
    await supabase.from("addresses").delete().eq("id", id).eq("user_id", userId);
    await load();
  }

  function edit(a: Address) {
    setEditingId(a.id);
    setForm({
      label: a.label,
      full_name: a.full_name,
      phone: a.phone,
      department: a.department,
      municipality: a.municipality,
      address: a.address,
      notes: a.notes,
      is_default: a.is_default,
    });
  }

  const input =
    "mt-1 w-full border border-[var(--ink)]/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          {editingId ? "Editar dirección" : "Nueva dirección"}
        </h2>
        {error && (
          <p className="mt-3 text-sm text-[var(--accent)]">{error}</p>
        )}
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm">
            Etiqueta
            <input
              className={input}
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Casa, Trabajo…"
            />
          </label>
          <label className="block text-sm">
            Nombre
            <input
              required
              className={input}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Teléfono
            <input
              required
              className={input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Departamento
            <select
              className={input}
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            >
              {DEPARTMENTS_GT.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Municipio
            <input
              required
              className={input}
              value={form.municipality}
              onChange={(e) =>
                setForm({ ...form, municipality: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            Dirección
            <input
              required
              className={input}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Notas
            <input
              className={input}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) =>
                setForm({ ...form, is_default: e.target.checked })
              }
            />
            Usar como dirección principal
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[var(--ink)] px-5 py-2.5 text-xs tracking-[0.16em] text-white uppercase"
            >
              Guardar
            </button>
            {editingId && (
              <button
                type="button"
                className="text-xs tracking-[0.16em] uppercase text-[var(--muted)]"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Guardadas
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Cargando…</p>
        ) : addresses.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Aún no tienes direcciones. Agrega una para agilizar el checkout.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="border border-[var(--ink)]/10 bg-white p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {a.label}
                      {a.is_default ? " · Principal" : ""}
                    </p>
                    <p className="mt-1 text-[var(--muted)]">
                      {a.full_name} · {a.phone}
                      <br />
                      {a.address}, {a.municipality}, {a.department}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-xs uppercase tracking-wide">
                    <button
                      type="button"
                      className="text-[var(--accent)]"
                      onClick={() => edit(a)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="text-[var(--muted)]"
                      onClick={() => remove(a.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
