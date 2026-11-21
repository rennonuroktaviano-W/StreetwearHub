import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/checkout");

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      label: true,
      recipient: true,
      phone: true,
      province: true,
      city: true,
      district: true,
      postalCode: true,
      detail: true,
    },
  });

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Checkout</p>
      <h1 className="font-display mt-2 text-4xl uppercase md:text-5xl">Finalisasi Pesanan</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
        <CheckoutForm addresses={addresses} />
        <aside className="card-sh h-fit p-5">
          <h2 className="font-display text-xl uppercase">Sebelum Bayar</h2>
          <ul className="mt-3 space-y-2 text-xs text-muted">
            <li>• Pastikan alamat dan nomor telepon aktif.</li>
            <li>• Harga dan stok divalidasi ulang saat checkout.</li>
            <li>• Stok dipotong hanya setelah pembayaran terverifikasi.</li>
            <li>• Pesanan dibatalkan otomatis setelah 24 jam.</li>
          </ul>
          <Link href="/keranjang" className="mt-5 inline-block text-[11px] font-bold uppercase tracking-widest text-accent">
            ← Kembali ke Keranjang
          </Link>
        </aside>
      </div>
    </section>
  );
}
