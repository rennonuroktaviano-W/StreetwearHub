import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { ProductExperience } from "@/components/product-experience";
import { formatRupiah } from "@/lib/constants";
import { getBadges, minPrice, type ProductBadge, type ProductCardData } from "@/lib/product";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

const publicProductWhere = {
  status: "ACTIVE" as const,
  seller: { status: "APPROVED" as const },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { ...publicProductWhere, slug },
    select: {
      name: true,
      description: true,
      images: { orderBy: { position: "asc" }, take: 1, select: { url: true } },
    },
  });
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/produk/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

const badgeStyle: Record<ProductBadge, string> = {
  NEW: "bg-white text-ink",
  LIMITED: "bg-accent text-white",
  "SOLD OUT": "bg-[#333] text-white",
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { ...publicProductWhere, slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
      seller: { select: { name: true, slug: true, logoUrl: true, description: true } },
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
    },
  });
  if (!product) notFound();

  const badges = getBadges(product);
  const prices = product.variants.map((v) => v.price);
  const low = minPrice(product.variants);
  const high = prices.length ? Math.max(...prices) : 0;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const relatedRaw = product.categoryId
    ? await prisma.product.findMany({
        where: {
          ...publicProductWhere,
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
          variants: true,
          seller: { select: { name: true, slug: true } },
          brand: { select: { name: true } },
        },
      })
    : [];

  const related: ProductCardData[] = relatedRaw;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/kategori/${product.category.slug}`} className="hover:text-accent">{product.category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-paper">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductExperience
          images={product.images.map((image) => ({ url: image.url, alt: image.alt }))}
          name={product.name}
          productId={product.id}
          productSlug={product.slug}
          image={product.images[0]?.url ?? null}
          sellerName={product.seller.name}
          sellerSlug={product.seller.slug}
          variants={product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            price: v.price,
            stock: v.stock,
          }))}
          details={
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeStyle[badge]}`}>
                    {badge}
                  </span>
                ))}
              </div>

              {product.brand && (
                <Link href={`/brand/${product.brand.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
                  {product.brand.name}
                </Link>
              )}
              <h1 className="mt-2 font-display text-4xl uppercase leading-tight md:text-5xl">{product.name}</h1>
              <p className="mt-3 text-xs uppercase tracking-widest text-muted">
                Terjual {product.soldCount} • Sisa {totalStock} stok
              </p>

              <div className="mt-5 border-y border-line py-5">
                <p className="font-display text-4xl text-accent md:text-5xl">
                  {low === high ? formatRupiah(low) : `${formatRupiah(low)} – ${formatRupiah(high)}`}
                </p>
              </div>

              <section className="mt-8" aria-labelledby="deskripsi-title">
                <h2 id="deskripsi-title" className="mb-3 text-xs font-bold uppercase tracking-widest">Deskripsi</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{product.description}</p>
              </section>

              <section className="card-sh mt-8 flex items-center gap-4 p-4" aria-labelledby="toko-title">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-line bg-[#141414]">
                  {product.seller.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.seller.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center font-display text-xl text-accent">
                      {product.seller.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted">Dijual oleh</p>
                  <h2 id="toko-title" className="truncate text-sm font-bold">{product.seller.name}</h2>
                  <p className="line-clamp-1 text-xs text-muted">{product.seller.description}</p>
                </div>
                <Link href={`/toko/${product.seller.slug}`} className="shrink-0 text-xs font-bold uppercase tracking-widest text-accent hover:underline">
                  Kunjungi
                </Link>
              </section>
            </>
          }
        />
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-12" aria-labelledby="related-title">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-accent">PILIHAN LAINNYA</p>
              <h2 id="related-title" className="mt-2 font-display text-3xl uppercase md:text-4xl">Produk Terkait</h2>
            </div>
            {product.category && (
              <Link href={`/kategori/${product.category.slug}`} className="text-xs font-bold uppercase tracking-widest hover:text-accent">
                Lihat Semua
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
