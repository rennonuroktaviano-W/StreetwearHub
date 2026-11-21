import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CartList } from "@/components/cart-list";
import { getSessionUser } from "@/lib/auth";

export const instant = false;
export const metadata: Metadata = { title: "Keranjang" };

export default async function KeranjangPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/keranjang");

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Cart</p>
      <h1 className="font-display mt-2 text-4xl uppercase md:text-5xl">Keranjang Belanja</h1>
      <p className="mt-3 text-sm text-muted">Item dikelompokkan berdasarkan toko. Ongkir dihitung oleh seller setelah pesanan dibayar.</p>
      <div className="mt-8">
        <CartList />
      </div>
    </section>
  );
}
