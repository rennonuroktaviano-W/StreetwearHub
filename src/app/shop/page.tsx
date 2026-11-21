import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { CatalogFilter } from "@/components/catalog-filter";
import { getCatalog, getFilterOptions, parseCatalogParams, type RawSearchParams } from "@/lib/catalog";

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

  if (total === 0) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <nav aria-label="Pagination katalog" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
          Sebelumnya
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`border px-4 py-2 text-xs font-bold ${
            p === page ? "border-accent bg-accent text-white" : "border-line hover:border-paper"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
          Berikutnya
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

      <header className="mb-10 border-b border-line pb-8">
        <p className="text-xs font-bold tracking-[0.3em] text-accent">JELAJAHI KATALOG</p>
        <h1 className="mt-3 font-display text-5xl uppercase md:text-7xl">Semua Produk</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Temukan streetwear dari brand independen favoritmu. Saring berdasarkan kategori, brand, ukuran, warna, dan harga.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <h2 className="mb-6 font-display text-2xl uppercase">Filter</h2>
            <Suspense fallback={<p className="text-sm text-muted">Memuat filter...</p>}>
              <CatalogFilter {...options} />
            </Suspense>
          </div>
        </aside>

        <section aria-label="Daftar produk">
          <details className="card-sh mb-8 p-4 lg:hidden">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Filter & Urutkan</summary>
            <div className="mt-6">
              <Suspense fallback={<p className="text-sm text-muted">Memuat filter...</p>}>
                <CatalogFilter {...options} />
              </Suspense>
            </div>
          </details>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-widest text-muted" aria-live="polite">
              {total} produk ditemukan
              {input.page > 1 ? ` • Halaman ${input.page}` : ""}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="card-sh flex flex-col items-center gap-4 px-6 py-20 text-center">
              <span className="font-display text-5xl text-[#333]">KOSONG</span>
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
