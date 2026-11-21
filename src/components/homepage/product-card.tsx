import Link from "next/link";
import { DummyProduct, formatPrice } from "@/data/home";
import { AddToCartButton } from "@/components/homepage/add-to-cart-button";
import { CardModel3DLazy } from "@/components/three/card-model-3d-lazy";

const BADGE_STYLE: Record<NonNullable<DummyProduct["badge"]>, string> = {
  NEW: "bg-offwhite text-black-sh",
  LIMITED: "bg-accent text-offwhite",
  "SOLD OUT": "bg-mid text-offwhite",
};

export function ProductCard({ product }: { product: DummyProduct }) {
  return (
    <article className="product-card group">
      <div className="relative aspect-[3/4] overflow-hidden border border-mid bg-charcoal">
        <div className="absolute inset-0 z-0">
          <CardModel3DLazy
            url={product.modelUrl}
            fallbackImage={product.image}
            name={product.name}
            color={product.badge === "SOLD OUT" ? "#2e2e2e" : null}
          />
        </div>
        <Link href={`/produk/${product.id}`} className="absolute inset-0 z-10" aria-label={`Lihat ${product.name}`} data-cursor />
        {product.badge && (
          <span className={`pointer-events-none absolute left-2 top-2 z-20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLE[product.badge]} ${product.badge === "LIMITED" ? "sh-pulse" : ""}`}>
            {product.badge}
          </span>
        )}
        <span className="pointer-events-none absolute bottom-2 right-2 z-20 border border-mid bg-black-sh/70 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-muted">
          3D
        </span>
        <div className="add-to-cart-wrap absolute inset-x-0 bottom-0 z-30 p-2">
          <AddToCartButton product={product} />
        </div>
      </div>
      <Link href={`/produk/${product.id}`} className="block pt-3" data-cursor>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{product.seller}</p>
        <h3 className="mt-1 truncate text-sm font-semibold text-offwhite transition-colors duration-200 group-hover:text-accent">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-offwhite">{formatPrice(product.price)}</span>
          <span className="text-lg text-muted transition-colors duration-200 group-hover:text-accent" aria-hidden>→</span>
        </div>
      </Link>
    </article>
  );
}
