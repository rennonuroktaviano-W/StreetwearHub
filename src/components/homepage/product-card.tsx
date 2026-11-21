import Image from "next/image";
import Link from "next/link";
import { DummyProduct, formatPrice } from "@/data/home";

const BADGE_STYLE: Record<NonNullable<DummyProduct["badge"]>, string> = {
  NEW: "bg-offwhite text-black-sh",
  LIMITED: "bg-accent text-offwhite",
  "SOLD OUT": "bg-mid text-offwhite",
};

export function ProductCard({ product }: { product: DummyProduct }) {
  return (
    <article>
      <Link href={`/produk/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden border border-mid bg-charcoal">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
          {product.badge && (
            <span className={`absolute left-2 top-2 px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLE[product.badge]}`}>
              {product.badge}
            </span>
          )}
        </div>
        <div className="pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{product.seller}</p>
          <h3 className="mt-1 truncate text-sm font-semibold text-offwhite transition-colors duration-200 group-hover:text-accent">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-offwhite">{formatPrice(product.price)}</span>
            <span className="text-lg text-muted transition-colors duration-200 group-hover:text-accent" aria-hidden>
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
