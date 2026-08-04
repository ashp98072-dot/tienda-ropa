/** Solo rutas internas (evita open redirect). */
export function safeNextPath(value: string | null | undefined, fallback = "/cuenta") {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.startsWith("/api")) return fallback;
  return value;
}
