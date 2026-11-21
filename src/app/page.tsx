import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ProductCard } from "@/components/product-card";
import Image from "next/image";
import Link from "next/link";

export const instant = false;

async function getHomeData() {
  const [categories, fresh, featured] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 10,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: true,
        seller: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ soldCount: "desc" }, { createdAt: "desc" }],
      take: 5,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        variants: true,
        seller: { select: { name: true, slug: true } },
      },
    }),
  ]);
  return { categories, fresh, featured };
}

export default async function HomePage() {
  const user = await getSessionUser();
  const { categories, fresh, featured } = await getHomeData();

  return (
    <>
      <section className="relative border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-accent">
              DROP BARU / EDISI TERBATAS
            </p>
            <h1 className="font-display text-6xl leading-[0.9] uppercase sm:text-7xl md:text-8xl">
              WEAR YOUR
              <br />
              <span className="text-accent">STREET.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
              Satu tempat untuk hoodie, kaos, dan sneakers dari brand independen
              pilihan. Kurasi ketat, stok jelas, checkout sekali jalan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-outline">
                Shop Sekarang
              </Link>
              {!user && (
                <Link href="/register" className="btn-accent">
                  Gabung Seller
                </Link>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden border border-line bg-[#151515]">
            <Image
              src="/images/hero-model.svg"
              alt="Model mengenakan streetwear dari StreetwearHub"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8" aria-labelledby="kategori-title">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent">JELAJAHI</p>
            <h2 id="kategori-title" className="font-display text-4xl uppercase md:text-5xl">
              Kategori
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-accent">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {categories.length === 0 ? (
            <div className="col-span-full bg-ink p-10 text-center text-sm text-muted">
              Kategori belum tersedia.
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="group relative aspect-square overflow-hidden bg-[#141414] p-5"
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-70 transition group-hover:scale-105 group-hover:opacity-90"
                  />
                ) : (
                  <span className="font-display text-5xl text-[#222] transition group-hover:text-[#2c2c2c]">
                    {category.name.slice(0, 1)}
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 pt-12">
                  <h3 className="font-display text-2xl uppercase">{category.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border-y border-line bg-[#0d0d0d]" aria-labelledby="fresh-title">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-accent">BARU TIBA</p>
              <h2 id="fresh-title" className="font-display text-4xl uppercase md:text-5xl">
                Fresh Drops
              </h2>
            </div>
            <Link href="/shop?sort=newest" className="text-xs font-bold uppercase tracking-widest hover:text-accent">
              View All →
            </Link>
          </div>
          {fresh.length === 0 ? (
            <div className="border border-dashed border-line p-12 text-center text-sm text-muted">
              Belum ada produk aktif. Jadilah seller pertama dan isi katalog ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {fresh.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-line" aria-label="Keunggulan layanan">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line px-0 md:grid-cols-4 md:px-8">
          {(["Pengiriman Cepat", "Pembayaran Aman", "Pengembalian Mudah", "Kualitas Premium"] as const).map(
            (title, i) => (
              <div key={title} className="bg-ink px-5 py-8 text-center">
                <span className="mb-3 block font-display text-3xl text-accent">0{i + 1}</span>
                <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
                <p className="mt-2 text-[11px] text-muted">
                  {["Dari seller ke pintumu", "VA, e-wallet, QRIS", "Proses dibantu admin", "Brand terverifikasi"][i]}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8" aria-labelledby="featured-title">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent">PILIHAN KAMI</p>
            <h2 id="featured-title" className="font-display text-4xl uppercase md:text-5xl">
              Featured Products
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-accent">
            Lihat Semua →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="border border-dashed border-line p-12 text-center text-sm text-muted">
            Produk unggulan akan muncul setelah seller menayangkan produk.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line bg-accent px-5 py-14 text-center text-white">
        <h2 className="font-display text-4xl uppercase md:text-6xl">Punya Brand Sendiri?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm opacity-90">
          Daftar sebagai seller, dapatkan toko online yang keren tanpa perlu bangun website dari nol.
          Verifikasi oleh admin, lalu mulai jualan.
        </p>
        <Link
          href="/seller/daftar"
          className="mt-7 inline-flex border border-white px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-accent"
        >
          Daftar Jadi Seller
        </Link>
      </section>
    </>
  );
}
