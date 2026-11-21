import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-3xl uppercase">
            Street<span className="text-accent">Hub</span>
          </p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
            Marketplace streetwear yang mempertemukan brand independen dengan pembeli di seluruh Indonesia.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest">Belanja</h2>
          <ul className="space-y-2 text-xs text-muted">
            <li><Link href="/shop" className="hover:text-accent">Semua Produk</Link></li>
            <li><Link href="/shop?sort=newest" className="hover:text-accent">Fresh Drops</Link></li>
            <li><Link href="/keranjang" className="hover:text-accent">Keranjang</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest">Akun</h2>
          <ul className="space-y-2 text-xs text-muted">
            <li><Link href="/login" className="hover:text-accent">Masuk</Link></li>
            <li><Link href="/register" className="hover:text-accent">Daftar</Link></li>
            <li><Link href="/seller/daftar" className="hover:text-accent">Jadi Seller</Link></li>
            <li><Link href="/akun/pesanan" className="hover:text-accent">Pesanan Saya</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest">Ikuti Kami</h2>
          <div className="flex gap-3">
            {["IG", "TT", "X"].map((s) => (
              <span key={s} className="flex h-9 w-9 items-center justify-center border border-line text-[10px] font-bold hover:border-accent hover:text-accent">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[10px] uppercase tracking-widest text-muted">Bergabunglah dengan komunitas kami.</p>
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 text-center text-[10px] uppercase tracking-widest text-muted">
        © 2026 {SITE_NAME}. Seluruh hak dilindungi.
      </div>
    </footer>
  );
}
