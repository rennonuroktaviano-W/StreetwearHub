import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-mid bg-charcoal" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-20">
        <div>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Marketplace Streetwear #1
          </p>
          <h1 id="hero-title" className="font-display text-5xl leading-[0.92] uppercase text-offwhite sm:text-6xl lg:text-7xl">
            Built for the<br />
            <span className="text-accent">Real Ones.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Temukan kaos, jaket, dan sneakers dari toko independen pilihan. Satu katalog,
            satu keranjang, banyak cerita.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-outline">
              Shop Now
              <span aria-hidden>→</span>
            </Link>
            <Link href="/seller/daftar" className="border border-mid px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-offwhite transition-colors duration-200 hover:border-muted">
              Jadi Seller
            </Link>
          </div>
          <dl className="mt-10 flex gap-8 border-t border-mid pt-6">
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted">Toko</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">120+</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted">Produk</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">2.400+</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-widest text-muted">Kota</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">38</dd>
            </div>
          </dl>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden border border-mid bg-black-sh">
          <Image
            src="/images/placeholder-hero.svg"
            alt="Model streetwear dalam balutan kaos dan jaket StreetwearHub"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
