import Link from "next/link";
import { FEATURED_PRODUCTS } from "@/data/home";
import { ProductCard } from "@/components/homepage/product-card";

export function ProductGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8" aria-labelledby="featured-title">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Pilihan Kami</p>
          <h2 id="featured-title" className="font-display text-3xl uppercase text-offwhite md:text-4xl">
            Featured Products
          </h2>
        </div>
        <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors duration-200 hover:text-offwhite">
          Lihat Semua →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
