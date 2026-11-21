import Link from "next/link";
import type { Metadata } from "next";
import { TRUST_ITEMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenalan dengan StreetwearHub, marketplace streetwear multi-seller untuk brand independen Indonesia.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-line bg-[#0d0d0d] px-5 py-20 text-center md:py-28">
        <p className="text-xs font-bold tracking-[0.3em] text-accent">TENTANG STREETWEARHUB</p>
        <h1 className="mt-4 font-display text-6xl uppercase md:text-8xl">
          STREE<span className="text-accent">T</span>CULTURE
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
          StreetwearHub adalah marketplace streetwear multi-seller yang mempertemukan brand independen
          dengan komunitas streetwear di seluruh Indonesia. Satu tempat untuk menemukan drop terbaru,
          berbelanja dengan aman, dan mendukung kreator lokal.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8" aria-labelledby="misi-title">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-accent">MISI KAMI</p>
            <h2 id="misi-title" className="mt-3 font-display text-4xl uppercase">Akses Mudah, Kualitas Utuh</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Kami percaya gaya jalanan lahir dari komunitas. Karena itu kami membangun ruang yang adil
            bagi seller independen untuk menampilkan karya mereka, dan bagi pembeli untuk menemukan potongan
            yang benar-benar mereka cintai. Setiap toko terverifikasi, setiap stok jelas, setiap transaksi
            dilindungi.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-[#0d0d0d]" aria-label="Keunggulan layanan">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.title} className="bg-ink px-6 py-10">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-xs font-bold uppercase tracking-widest">{item.title}</h3>
              <p className="mt-2 text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8">
        <h2 className="font-display text-4xl uppercase">Punya Brand Sendiri?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
          Bergabung sebagai seller dan mulai jualan di depan komunitas streetwear seluruh Indonesia.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/seller/daftar" className="btn-accent">Daftar Jadi Seller</Link>
          <Link href="/shop" className="btn-outline">Jelajahi Katalog</Link>
        </div>
      </section>
    </div>
  );
}
