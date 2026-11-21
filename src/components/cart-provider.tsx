"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  key: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  price: number;
  quantity: number;
  maxStock: number;
  image: string | null;
  sellerName: string;
  sellerSlug: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  groups: { sellerSlug: string; sellerName: string; items: CartItem[]; subtotal: number }[];
  total: number;
};

const STORAGE_KEY = "sh_cart_v1";
const CART_EVENT = "sh-cart-change";
const CartContext = createContext<CartContextValue | null>(null);

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as CartItem[];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  return parse(window.localStorage.getItem(STORAGE_KEY));
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => {
      const next = read();
      setItems((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next));
    };
    const id = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    window.addEventListener(CART_EVENT, sync);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("storage", sync);
      window.removeEventListener(CART_EVENT, sync);
    };
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    const current = read();
    const key = item.variantId;
    const existing = current.find((i) => i.key === key);
    if (existing) {
      write(
        current.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) } : i,
        ),
      );
      return;
    }
    write([...current, { ...item, key, quantity: Math.min(quantity, item.maxStock) }]);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    write(
      read()
        .map((i) => (i.key === key ? { ...i, quantity: Math.max(0, Math.min(quantity, i.maxStock)) } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    write(read().filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => write([]), []);

  const groups = useMemo(() => {
    const map = new Map<string, CartContextValue["groups"][number]>();
    for (const item of items) {
      const group = map.get(item.sellerSlug) ?? {
        sellerSlug: item.sellerSlug,
        sellerName: item.sellerName,
        items: [],
        subtotal: 0,
      };
      group.items.push(item);
      group.subtotal += item.price * item.quantity;
      map.set(item.sellerSlug, group);
    }
    return [...map.values()];
  }, [items]);

  const total = useMemo(() => groups.reduce((sum, g) => sum + g.subtotal, 0), [groups]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, count, addItem, updateQuantity, removeItem, clear, groups, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
