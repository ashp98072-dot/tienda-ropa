"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ineedyou-cart";

function itemKey(productId: string, size: string, color: string) {
  return `${productId}::${size}::${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(
    product: Product,
    size: string,
    color: string,
    quantity = 1,
  ) {
    setItems((prev) => {
      const key = itemKey(product.id, size, color);
      const existing = prev.find(
        (i) => itemKey(i.productId, i.size, i.color) === key,
      );
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
        },
      ];
    });
  }

  function removeItem(productId: string, size: string, color: string) {
    const key = itemKey(productId, size, color);
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.size, i.color) !== key),
    );
  }

  function updateQuantity(
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) {
    if (quantity < 1) {
      removeItem(productId, size, color);
      return;
    }
    const key = itemKey(productId, size, color);
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.productId, i.size, i.color) === key ? { ...i, quantity } : i,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
