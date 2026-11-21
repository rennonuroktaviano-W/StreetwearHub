import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink px-5 py-20">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-accent">ERROR / 404</p>
        <h1 className="mt-4 font-display text-8xl leading-none md:text-9xl">404</h1>
        <h2 className="mt-6 font-display text-3xl uppercase">Halaman Tak Ditemukan</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Sepertinya jalur yang kamu cari tidak tersedia. Yuk kembali ke katalog dan temukan drop lainnya.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-outline">Kembali ke Home</Link>
          <Link href="/shop" className="btn-accent">Jelajahi Shop</Link>
        </div>
      </div>
    </div>
  );
}
