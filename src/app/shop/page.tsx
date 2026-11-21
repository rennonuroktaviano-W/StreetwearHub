import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { CatalogFilter } from "@/components/catalog-filter";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { getCatalog, getFilterOptions, parseCatalogParams, type RawSearchParams } from "@/lib/catalog";

export const instant = false;

type Props = { searchParams: Promise<RawSearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = parseCatalogParams(await searchParams);
  const label = query.q ? `Hasil pencarian “${query.q}”` : "Katalog Produk";
  return {
    title: label,
    description: `Jelajahi ${label} di StreetwearHub. Filter kategori, brand, ukuran, warna, dan harga.`,
    alternates: { canonical: "/shop" },
  };
}

function Pagination({
  page,
  totalPages,
  total,
  params,
}: {
  page: number;
  totalPages: number;
  total: number;
  params: RawSearchParams;
}) {
  const href = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) value.forEach((v) => search.append(key, v));
      else search.set(key, value);
    }
    search.set("page", String(target));
    return `/shop?${search.toString()}`;
  };

  if (total === 0 || totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination katalog" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className="border border-line px-4 py-2 text-xs font-bold uppercase transition-colors duration-200 hover:border-accent">
          ← Sebelumnya
        </Link>
      )}
      <span className="px-3 text-xs uppercase tracking-widest text-muted">
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link href={href(page + 1)} className="border border-line px-4 py-2 text-xs font-bold uppercase transition-colors duration-200 hover:border-accent">
          Berikutnya →
        </Link>
      )}
    </nav>
  );
}

export default async function ShopPage({ searchParams }: Props) {
  const raw = await searchParams;
  const input = parseCatalogParams(raw);
  const [{ products, total, page, totalPages }, options] = await Promise.all([
    getCatalog(input),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-[10px] uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="px-2">/</span>
        <span className="text-paper">Shop</span>
      </nav>

      <header className="mb-8 border-b border-line pb-8">
        <p className="text-[11px] font-bold tracking-[0.3em] text-accent">JELAJAHI KATALOG</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl uppercase md:text-7xl">Semua Produk</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Streetwear pilihan dari seller independen. Saring berdasarkan kategori, brand, ukuran, warna, dan harga.
            </p>
          </div>
          <p className="border border-line px-4 py-2 text-xs uppercase tracking-widest text-muted" aria-live="polite">
            {total} produk
          </p>
        </div>
      </header>

      <Suspense fallback={<div className="card-sh mb-6 h-14" />}>
        <CatalogToolbar />
      </Suspense>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <Suspense fallback={<p className="text-sm text-muted">Memuat filter...</p>}>
              <CatalogFilter {...options} />
            </Suspense>
          </div>
        </aside>

        <section aria-label="Daftar produk">
          <details className="card-sh mb-6 p-4 lg:hidden">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Filter produk</summary>
            <div className="mt-5">
              <Suspense fallback={<p className="text-sm text-muted">Memuat filter...</p>}>
                <CatalogFilter {...options} />
              </Suspense>
            </div>
          </details>

          {products.length === 0 ? (
            <div className="card-sh flex flex-col items-center gap-4 px-6 py-20 text-center">
              <span className="font-display text-5xl text-mid">KOSONG</span>
              <h2 className="text-lg font-bold">Produk tidak ditemukan</h2>
              <p className="max-w-sm text-sm text-muted">
                Coba ubah kata kunci atau hapus sebagian filter untuk melihat lebih banyak produk.
              </p>
              <Link href="/shop" className="btn-outline mt-2">Lihat Semua Produk</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} total={total} params={raw} />
        </section>
      </div>
    </div>
  );
}
