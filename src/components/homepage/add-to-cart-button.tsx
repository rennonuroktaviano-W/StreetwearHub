"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import type { DummyProduct } from "@/data/home";

export function AddToCartButton({ product, isLoggedIn = false }: { product: DummyProduct; isLoggedIn?: boolean }) {
  const { addItem } = useCart();
  const router = useRouter();
  const soldOut = product.badge === "SOLD OUT";

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => {
        if (!isLoggedIn) {
          router.push("/login?next=/keranjang");
          return;
        }
        addItem({
          variantId: `dummy-${product.id}`,
          productId: product.id,
          productName: product.name,
          productSlug: product.id,
          variantName: "Satu ukuran",
          price: product.price,
          maxStock: product.badge === "LIMITED" ? 3 : 10,
          image: product.image,
          sellerName: product.seller,
          sellerSlug: product.seller.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        });
      }}
      className="add-to-cart w-full bg-offwhite py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-black-sh transition-colors duration-200 hover:bg-accent hover:text-offwhite disabled:cursor-not-allowed disabled:bg-mid disabled:text-muted"
    >
      {soldOut ? "Sold Out" : "Add to Cart"}
    </button>
  );
}
