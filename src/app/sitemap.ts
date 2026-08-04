import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  const staticRoutes = [
    "",
    "/tienda",
    "/deseos",
    "/carrito",
    "/checkout",
    "/envios",
    "/devoluciones",
    "/privacidad",
    "/contacto",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const products = await listProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
