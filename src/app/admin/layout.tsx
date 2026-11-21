import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sellers", label: "Verifikasi Seller" },
  { href: "/admin/kategori", label: "Kategori" },
  { href: "/admin/brand", label: "Brand" },
  { href: "/admin/produk", label: "Produk" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") redirect("/403");

  return (
    <div className="min-h-screen bg-ink">
      <div className="border-b border-line px-5 py-3 md:hidden">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Admin Center</p>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-line md:min-h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="hidden border-b border-line p-6 md:block">
            <p className="font-display text-2xl uppercase">Admin<span className="text-accent">Hub</span></p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">{user.email}</p>
          </div>
          <nav aria-label="Navigasi admin" className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible">
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
            <Link href="/" className="text-[11px] text-muted underline hover:text-accent">Lihat marketplace</Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
          <header className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Dashboard Admin</p>
            <h1 className="mt-1 font-display text-3xl uppercase md:text-4xl">Kelola Platform</h1>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
