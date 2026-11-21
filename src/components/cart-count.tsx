"use client";

import { useCart } from "@/components/cart-provider";

export function CartCount() {
  const { count } = useCart();
  if (!count) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] font-bold text-white">
      {count}
    </span>
  );
}
