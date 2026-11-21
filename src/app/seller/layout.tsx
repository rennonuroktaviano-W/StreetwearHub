import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

const nav = [
  { href: "/seller", label: "Dashboard" },
  { href: "/seller/profil", label: "Profil Toko" },
  { href: "/seller/produk", label: "Produk" },
  { href: "/seller/stok", label: "Stok" },
  { href: "/seller/pesanan", label: "Pesanan" },
];

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    redirect("/403");
  }
  if (!user.seller) {
    redirect("/seller/daftar");
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="border-b border-line px-5 py-3 md:hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Seller Center</p>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-0 md:flex-row">
        <aside className="border-b border-line md:min-h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="hidden border-b border-line p-6 md:block">
            <p className="font-display text-2xl uppercase">Seller<span className="text-accent">Hub</span></p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">{user.seller.name}</p>
          </div>
          <nav aria-label="Navigasi seller" className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border border-transparent px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted hover:border-line hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden border-t border-line p-6 md:block">
            <p className="text-[10px] uppercase tracking-widest text-muted">Status toko</p>
            <p className="mt-1 text-xs font-bold uppercase text-accent">{user.seller.status}</p>
            <Link href="/" className="mt-4 inline-block text-[11px] text-muted underline hover:text-accent">
              Lihat marketplace
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
          <header className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Dashboard Seller</p>
            <h1 className="mt-1 font-display text-3xl uppercase md:text-4xl">Kelola Toko</h1>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
