import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCatalog, parseCatalogParams, type RawSearchParams } from "@/lib/catalog";

type ListingInput = {
  title: string;
  eyebrow: string;
  description?: string | null;
  imageUrl?: string | null;
  basePath: string;
  searchParams: Promise<RawSearchParams>;
  scope: { categorySlug?: string; brandSlug?: string; sellerSlug?: string };
  breadcrumbLabel: string;
};

function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={`${basePath}?page=${page - 1}`} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
          Sebelumnya
        </Link>
      )}
      <span className="px-3 text-xs text-muted">{page} / {totalPages}</span>
      {page < totalPages && (
        <Link href={`${basePath}?page=${page + 1}`} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
          Berikutnya
        </Link>
      )}
    </nav>
  );
}

export async function ListingPage({
  title,
  eyebrow,
  description,
  imageUrl,
  basePath,
  searchParams,
  scope,
  breadcrumbLabel,
}: ListingInput) {
  const input = parseCatalogParams(await searchParams);
  const { products, total, page, totalPages } = await getCatalog({ ...input, ...scope });

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-[10px] uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="px-2">/</span>
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        <span className="px-2">/</span>
        <span className="text-paper">{breadcrumbLabel}</span>
      </nav>

      <header className="mb-12 flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] text-accent">{eyebrow}</p>
          <h1 className="mt-3 font-display text-5xl uppercase md:text-7xl">{title}</h1>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
          ) : null}
          <p className="mt-4 text-xs uppercase tracking-widest text-muted">{total} produk tersedia</p>
        </div>
        {imageUrl ? (
          <div className="relative h-28 w-full max-w-xs border border-line bg-[#141414] sm:h-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={title} className="h-full w-full object-contain p-3" />
          </div>
        ) : null}
      </header>

      {products.length === 0 ? (
        <div className="card-sh px-6 py-20 text-center">
          <h2 className="text-lg font-bold">Belum ada produk di sini</h2>
          <p className="mt-2 text-sm text-muted">Produk akan muncul setelah seller menayangkan produknya.</p>
          <Link href="/shop" className="btn-outline mt-6">Lihat Semua Produk</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath={basePath} />
    </div>
  );
}
