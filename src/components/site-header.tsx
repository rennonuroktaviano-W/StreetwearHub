import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { CartCount } from "@/components/cart-count";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <>
      <div className="border-b border-line bg-black px-5 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
        <span className="text-accent">Promo:</span> Gratis ongkir untuk pesanan pertama &nbsp;·&nbsp; IDR / Indonesia
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
          <Link href="/" className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
            Street<span className="text-accent">Hub</span>
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-7 md:flex">
            <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-accent">Home</Link>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest hover:text-accent">Shop</Link>
            <Link href="/shop?sort=newest" className="text-xs font-bold uppercase tracking-widest hover:text-accent">Collections</Link>
            <Link href="/about" className="text-xs font-bold uppercase tracking-widest hover:text-accent">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/shop" aria-label="Cari produk" className="hover:text-accent">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
            </Link>
            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : user.role === "SELLER" ? "/seller" : "/akun") : "/login"}
              aria-label="Akun"
              className="hover:text-accent"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>
            <Link href="/keranjang" aria-label="Keranjang" className="relative hover:text-accent">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <CartCount />
            </Link>
          </div>
        </div>
        <nav aria-label="Navigasi mobile" className="flex gap-6 overflow-x-auto border-t border-line px-5 py-3 md:hidden">
          {[["/", "Home"], ["/shop", "Shop"], ["/shop?sort=newest", "Collections"], ["/about", "About"]].map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-muted">
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
