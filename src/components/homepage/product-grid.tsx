import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { productCardInclude } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma-client";

export type FeaturedProduct = Prisma.ProductGetPayload<{ include: typeof productCardInclude }>;

export function ProductGrid({ products }: { products: FeaturedProduct[] }) {
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

      {products.length === 0 ? (
        <p className="border border-dashed border-line p-12 text-center text-sm text-muted">
          Produk unggulan akan muncul setelah seller menayangkan produk.
        </p>
      ) : (
        <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-5" stagger={0.06}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGroup>
      )}
    </section>
  );
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: "ACTIVE", seller: { status: "APPROVED" } },
    orderBy: [{ soldCount: "desc" }, { publishedAt: "desc" }],
    take: 5,
    include: productCardInclude,
  });
}
