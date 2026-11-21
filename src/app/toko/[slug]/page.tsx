import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { getCatalog, parseCatalogParams, type RawSearchParams } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seller = await prisma.seller.findUnique({
    where: { slug },
    select: { name: true, description: true, status: true },
  });
  if (!seller || seller.status !== "APPROVED") return { title: "Toko tidak ditemukan" };
  return {
    title: `Toko ${seller.name}`,
    description: seller.description,
    alternates: { canonical: `/toko/${slug}` },
  };
}

export default async function SellerPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const seller = await prisma.seller.findFirst({
    where: { slug, status: "APPROVED" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      bannerUrl: true,
      createdAt: true,
    },
  });
  if (!seller) notFound();

  const input = parseCatalogParams(await searchParams);
  const { products, total, page, totalPages } = await getCatalog({ ...input, sellerSlug: slug });

  return (
    <div>
      <div className="relative h-44 border-b border-line bg-[#141414] md:h-64">
        {seller.bannerUrl ? (
          <Image src={seller.bannerUrl} alt={`Banner toko ${seller.name}`} fill priority sizes="100vw" className="object-cover opacity-70" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-6xl text-[#222]">STREETWEARHUB</div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <nav aria-label="Breadcrumb" className="py-6 text-[10px] uppercase tracking-widest text-muted">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="px-2">/</span>
          <Link href="/shop" className="hover:text-accent">Shop</Link>
          <span className="px-2">/</span>
          <span className="text-paper">{seller.name}</span>
        </nav>

        <header className="flex flex-col gap-5 border-b border-line pb-10 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-line bg-[#141414]">
            {seller.logoUrl ? (
              <Image src={seller.logoUrl} alt={`Logo ${seller.name}`} fill sizes="96px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center font-display text-3xl text-accent">
                {seller.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent">TOKO TERVERIFIKASI</p>
            <h1 className="mt-2 font-display text-4xl uppercase md:text-5xl">{seller.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{seller.description}</p>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted">
              Bergabung sejak {new Date(seller.createdAt).getFullYear()} • {total} produk
            </p>
          </div>
        </header>

        <section className="pt-10" aria-label={`Produk dari ${seller.name}`}>
          <h2 className="mb-6 font-display text-2xl uppercase">Koleksi Toko</h2>
          {products.length === 0 ? (
            <div className="card-sh px-6 py-20 text-center">
              <p className="text-sm text-muted">Toko ini belum memiliki produk aktif.</p>
              <Link href="/shop" className="btn-outline mt-6">Jelajahi Produk Lain</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={`/toko/${slug}?page=${page - 1}`} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
                  Sebelumnya
                </Link>
              )}
              <span className="px-3 text-xs text-muted">{page} / {totalPages}</span>
              {page < totalPages && (
                <Link href={`/toko/${slug}?page=${page + 1}`} className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent">
                  Berikutnya
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
