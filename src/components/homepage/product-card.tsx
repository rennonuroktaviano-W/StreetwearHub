import Image from "next/image";
import Link from "next/link";
import { DummyProduct, formatPrice } from "@/data/home";
import { AddToCartButton } from "@/components/homepage/add-to-cart-button";

const BADGE_STYLE: Record<NonNullable<DummyProduct["badge"]>, string> = {
  NEW: "bg-offwhite text-black-sh",
  LIMITED: "bg-accent text-offwhite",
  "SOLD OUT": "bg-mid text-offwhite",
};

export function ProductCard({ product }: { product: DummyProduct }) {
  return (
    <article className="product-card group">
      <div className="relative aspect-[3/4] overflow-hidden border border-mid bg-charcoal">
        <Link href={`/produk/${product.id}`} className="absolute inset-0 z-0" aria-label={`Lihat ${product.name}`} data-cursor>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`product-image object-cover transition-opacity duration-300 ${product.hoverImage ? "group-hover:opacity-0" : ""}`}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="product-image-hover absolute inset-0 object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>
        {product.badge && (
          <span className={`pointer-events-none absolute left-2 top-2 z-20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLE[product.badge]} ${product.badge === "LIMITED" ? "sh-pulse" : ""}`}>
            {product.badge}
          </span>
        )}
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
