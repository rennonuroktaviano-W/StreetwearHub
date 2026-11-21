import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { minPrice } from "@/lib/product";

export const instant = false;

export const metadata: Metadata = {
  title: "Collections",
  description: "Koleksi kurasi StreetwearHub: essential tees, outerwear layer, footwear game, dan detail finishing.",
};

const COLLECTIONS = [
  {
    slug: "t-shirts",
    title: "Essential Tees",
    eyebrow: "Koleksi 01",
    description: "Kaos dan shirt serbaguna untuk tampilan harian yang nggak pernah basi.",
  },
  {
    slug: "footwear",
    title: "Footwear Game",
    eyebrow: "Koleksi 02",
    description: "Sepatu dan sneakers yang bikin setiap langkah terasa lebih percaya diri.",
  },
  {
    slug: "accessories",
    title: "Detail Finish",
    eyebrow: "Koleksi 03",
    description: "Kacamata, tas, dan aksesoris kecil yang mengubah seluruh look.",
  },
  {
    slug: "t-shirts",
    title: "Layer & Shirt",
    eyebrow: "Koleksi 04",
    description: "Pilihan shirt dengan karakter kuat untuk mix and match tanpa ribet.",
  },
] as const;

async function getCollection(slug: string, take: number) {
  return prisma.product.findMany({
    where: { status: "ACTIVE", seller: { status: "APPROVED" }, category: { slug } },
    orderBy: { publishedAt: "desc" },
    take,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: true,
      seller: { select: { name: true } },
    },
  });
}

export default async function CollectionsPage() {
  const groups = await Promise.all(
    COLLECTIONS.map(async (collection) => ({
      ...collection,
      products: await getCollection(collection.slug, 4),
    })),
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-[10px] uppercase tracking-widest text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="px-2">/</span>
        <span className="text-paper">Collections</span>
      </nav>

      <header className="mb-12 border-b border-line pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Kurasi StreetwearHub</p>
        <h1 className="mt-3 font-display text-5xl uppercase md:text-7xl">Collections</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Empat koleksi pilihan dari seller independen. Tiap koleksi punya karakter sendiri —
          pilih yang paling cocok dengan gaya kamu.
        </p>
      </header>

      <div className="space-y-16">
        {groups.map((collection) => (
          <section key={collection.title} aria-labelledby={`collection-${collection.title.replace(/\s+/g, "-").toLowerCase()}`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">{collection.eyebrow}</p>
                <h2 id={`collection-${collection.title.replace(/\s+/g, "-").toLowerCase()}`} className="mt-2 font-display text-3xl uppercase md:text-4xl">
                  {collection.title}
                </h2>
                <p className="mt-2 max-w-lg text-sm text-muted">{collection.description}</p>
              </div>
              <Link href={`/kategori/${collection.slug}`} className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors duration-200 hover:text-accent">
                Lihat Koleksi →
              </Link>
            </div>

            {collection.products.length === 0 ? (
              <p className="border border-dashed border-line p-10 text-center text-sm text-muted">
                Produk koleksi ini belum tersedia.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {collection.products.map((product) => {
                  const image = product.images[0];
                  return (
                    <Link key={product.id} href={`/produk/${product.slug}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden border border-line bg-[#141414] transition-colors duration-200 group-hover:border-accent/60">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.alt ?? product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-display text-4xl text-mid">SH</div>
                        )}
                      </div>
                      <div className="pt-3">
                        <p className="text-[10px] uppercase tracking-widest text-muted">{product.seller.name}</p>
                        <h3 className="mt-1 line-clamp-1 text-sm font-semibold group-hover:text-accent">{product.name}</h3>
                        <p className="mt-1 text-sm font-bold">{formatRupiah(minPrice(product.variants))}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
