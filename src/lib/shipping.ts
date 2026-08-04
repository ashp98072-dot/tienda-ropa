import { DEPARTMENTS_GT } from "./products";

export type ShippingMethod = "delivery" | "pickup";

export type DepartmentGT = (typeof DEPARTMENTS_GT)[number];

/** Zonas de envío — ajustar tarifas con Shannon */
const ZONE_METRO = new Set<string>(["Guatemala"]);
const ZONE_NEAR = new Set<string>([
  "Sacatepéquez",
  "Chimaltenango",
  "Escuintla",
  "El Progreso",
  "Santa Rosa",
]);
const ZONE_REMOTE = new Set<string>([
  "Petén",
  "Izabal",
  "Huehuetenango",
  "Alta Verapaz",
  "Quiché",
]);

export const FREE_SHIPPING_MIN = 500;

export const SHIPPING_LABELS: Record<ShippingMethod, string> = {
  delivery: "Envío a domicilio",
  pickup: "Retiro en tienda",
};

export function getShippingQuote(
  department: string,
  subtotal: number,
  method: ShippingMethod = "delivery",
): { amount: number; label: string; eta: string } {
  if (method === "pickup") {
    return {
      amount: 0,
      label: "Retiro en tienda (sin costo)",
      eta: "Disponible en 24–48 h hábiles",
    };
  }

  if (subtotal >= FREE_SHIPPING_MIN) {
    return {
      amount: 0,
      label: "Envío gratis",
      eta: etaForDepartment(department),
    };
  }

  let amount = 45;
  if (ZONE_METRO.has(department)) amount = 25;
  else if (ZONE_NEAR.has(department)) amount = 35;
  else if (ZONE_REMOTE.has(department)) amount = 55;

  return {
    amount,
    label: `Envío a ${department || "Guatemala"}`,
    eta: etaForDepartment(department),
  };
}

function etaForDepartment(department: string): string {
  if (ZONE_METRO.has(department)) return "1–2 días hábiles";
  if (ZONE_NEAR.has(department)) return "2–3 días hábiles";
  if (ZONE_REMOTE.has(department)) return "3–5 días hábiles";
  return "2–4 días hábiles";
}

export const SHIPPING_ZONES = [
  {
    name: "Área metropolitana",
    departments: ["Guatemala"],
    price: 25,
    eta: "1–2 días hábiles",
  },
  {
    name: "Departamentos cercanos",
    departments: [...ZONE_NEAR],
    price: 35,
    eta: "2–3 días hábiles",
  },
  {
    name: "Interior del país",
    departments: DEPARTMENTS_GT.filter(
      (d) => !ZONE_METRO.has(d) && !ZONE_NEAR.has(d) && !ZONE_REMOTE.has(d),
    ),
    price: 45,
    eta: "2–4 días hábiles",
  },
  {
    name: "Zonas alejadas",
    departments: [...ZONE_REMOTE],
    price: 55,
    eta: "3–5 días hábiles",
  },
] as const;
