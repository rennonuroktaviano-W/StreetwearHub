import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const instant = false;

export default async function AkunPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun");

  const links = [
    { href: "/akun/alamat", title: "Daftar Alamat", desc: "Kelola alamat pengiriman kamu." },
    { href: "/akun/pesanan", title: "Pesanan Saya", desc: "Lihat riwayat dan status pesanan." },
    ...(user.seller
      ? [{ href: "/seller", title: "Toko Seller", desc: "Kelola toko dan produk kamu." }]
      : [{ href: "/seller/daftar", title: "Jadi Seller", desc: "Ajukan toko baru dan mulai berjualan." }]),
  ];

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Area Akun</p>
      <h1 className="font-display mt-2 text-5xl uppercase md:text-6xl">Halo, {user.name.split(" ")[0]}</h1>
      <div className="card-sh mt-8 grid gap-6 p-6 sm:grid-cols-2">
        <div>
          <p className="label-sh">Nama Lengkap</p>
          <p className="text-lg">{user.name}</p>
        </div>
        <div>
          <p className="label-sh">Email</p>
          <p className="break-all text-lg">{user.email}</p>
        </div>
        <div>
          <p className="label-sh">Role</p>
          <p className="text-lg">{user.role}</p>
        </div>
        <div>
          <p className="label-sh">Bergabung Sejak</p>
          <p className="text-lg">{user.createdAt.toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="card-sh group p-6 hover:border-accent">
            <h2 className="font-display text-2xl uppercase group-hover:text-accent">{link.title}</h2>
            <p className="mt-2 text-sm text-muted">{link.desc}</p>
            <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-accent">Buka →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
