import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { SellerRegisterForm } from "@/components/seller-register-form";

export const instant = false;

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SellerDaftarPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next ?? "/seller/daftar")}`);
  if (user.seller) redirect("/seller");

  return (
    <section className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <Link href="/akun" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent">← Akun Saya</Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-accent">Mulai Berjualan</p>
      <h1 className="font-display mt-2 text-5xl uppercase md:text-6xl">Daftar Jadi Seller</h1>
      <p className="mt-3 text-sm text-muted">Isi data toko kamu. Tim kami akan memverifikasi pengajuan sebelum toko aktif.</p>
      <div className="mt-8">
        <SellerRegisterForm />
      </div>
    </section>
  );
}
