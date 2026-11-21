import Image from "next/image";
import Link from "next/link";
import { ProductBadge, getBadges, minPrice, ProductCardData } from "@/lib/product";
import { formatRupiah } from "@/lib/constants";

const badgeClass: Record<ProductBadge, string> = {
  NEW: "bg-white text-ink",
  LIMITED: "bg-accent text-white",
  "SOLD OUT": "bg-[#333] text-white",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const badges = getBadges(product);
  const image = product.images[0];

  return (
    <article className="group transition-transform duration-200 hover:-translate-y-1">
      <Link href={`/produk/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden border border-line bg-[#141414] transition-colors duration-200 group-hover:border-accent/60">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl text-[#242424]">
              SH
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${badgeClass[badge]}`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">{product.seller.name}</p>
          <h3 className="mt-1 line-clamp-1 text-sm font-semibold group-hover:text-accent">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-bold">{formatRupiah(minPrice(product.variants))}</span>
            <span className="text-lg text-muted transition-colors duration-200 group-hover:text-accent" aria-hidden>
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
