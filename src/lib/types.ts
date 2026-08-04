export type Segment = "ninos" | "adolescentes" | "adultos";
export type Gender = "mujer" | "hombre" | "unisex" | "nina" | "nino";
export type Category =
  | "blusas"
  | "jeans"
  | "sets"
  | "vestidos"
  | "shorts"
  | "accesorios"
  | "tops";

export type PaymentMethod = "tarjeta" | "contra_entrega" | "transferencia";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  category: Category;
  segment: Segment;
  gender: Gender;
  sizes: string[];
  colors: string[];
  /** Imagen principal (primera de images) */
  image: string;
  /** Galería completa; si falta, se usa [image] */
  images?: string[];
  isNew?: boolean;
  featured?: boolean;
  /** false = oculto en la tienda (sigue visible en admin) */
  active?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
}
