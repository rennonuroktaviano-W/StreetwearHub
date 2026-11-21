import Image from "next/image";
import Link from "next/link";

export function FreshDrops() {
  return (
    <section className="border-y border-mid bg-light" aria-labelledby="fresh-title">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_1.1fr_1fr] md:gap-10 md:px-8 md:py-16">
        <div className="text-black-sh">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Baru Tiba</p>
          <h2 id="fresh-title" className="mt-3 font-display text-4xl uppercase md:text-5xl">
            Fresh<br />Drops
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mid">
            Rilisan terbaru dari seller independen. Stok terbatas, jadi jangan tunggu terlalu lama.
          </p>
          <Link href="/shop?sort=newest" className="btn-outline mt-6 border-black-sh !text-black-sh hover:!bg-black-sh hover:!text-offwhite">
            View All
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden border border-mid bg-charcoal md:aspect-[3/4]">
          <Image
            src="/images/product-2.svg"
            alt="Jaket utility dari koleksi Fresh Drops StreetwearHub"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
        <div className="text-black-sh md:pl-2">
          <p className="font-display text-2xl uppercase leading-tight md:text-3xl">
            Wear it.<br />Own it.
          </p>
          <div className="mt-5 h-px w-12 bg-accent" />
          <p className="mt-5 text-sm leading-relaxed text-mid">
            Setiap potongan punya cerita. Didesain untuk dipakai setiap hari, bukan cuma dipajang.
          </p>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-mid">
            Kurasi / Kualitas / Karakter
          </p>
        </div>
      </div>
    </section>
  );
}
