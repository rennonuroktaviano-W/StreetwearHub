import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { SnapPayment } from "@/components/snap-payment";
import { formatAddress, parseAddressSnapshot } from "@/lib/order";

export const instant = false;

export const metadata: Metadata = { title: "Konfirmasi Pesanan" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
};

export default async function CheckoutOrderPage({ params, searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/checkout");
  const { id } = await params;
  const query = await searchParams;

  let order = await prisma.order.findFirst({ where: { id, buyerId: user.id }, include: { items: true } });
  if (!order) notFound();

  let autoCanceled = false;
  if (order.status === "MENUNGGU_PEMBAYARAN" && order.expiresAt < new Date()) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "DIBATALKAN", canceledAt: new Date() },
    });
    autoCanceled = true;
    order = { ...order, status: "DIBATALKAN" };
  }

  const address = parseAddressSnapshot(order.addressSnapshot);
  const isDevMode = Boolean(order.paymentToken?.startsWith("dev-"));
  const canPay = order.status === "MENUNGGU_PEMBAYARAN" && Boolean(order.paymentToken) && !isDevMode;

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{query.paid === "1" ? "Pembayaran Diproses" : "Pesanan Dibuat"}</p>
      <h1 className="font-display mt-2 text-4xl uppercase md:text-5xl">Konfirmasi Pesanan</h1>
      {query.paid === "1" ? (
        <p role="status" className="mt-6 border border-accent bg-accent/10 p-4 text-sm text-accent">
          Pembayaran berhasil dikirim. Status pesanan akan diperbarui otomatis setelah Midtrans mengonfirmasi.
        </p>
      ) : null}
      {autoCanceled ? (
        <p role="alert" className="mt-6 border border-muted p-4 text-sm text-muted">
          Pesanan kedaluwarsa setelah 24 jam dan otomatis dibatalkan. Silakan buat pesanan baru.
        </p>
      ) : null}

      <div className="card-sh mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted">Nomor Pesanan</p>
            <p className="font-display text-2xl uppercase">{order.orderNumber}</p>
          </div>
          <span className="border border-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            {order.status}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted">
          Bayar sebelum {order.expiresAt.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
        </p>
      </div>

      <div className="card-sh mt-4 p-5">
        <h2 className="font-display text-xl uppercase">Alamat Pengiriman</h2>
        <p className="mt-3 text-sm font-bold">{address.recipient}</p>
        <p className="text-sm text-muted">{address.phone}</p>
        <p className="mt-1 break-words text-sm text-muted">{formatAddress(address)}</p>
      </div>

      <div className="card-sh mt-4 p-5">
        <h2 className="font-display text-xl uppercase">Item</h2>
        <ul className="mt-3 divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3 first:pt-0 text-sm">
              <span className="min-w-0 text-muted">{item.quantity} × {item.productNameSnap} <span className="text-[11px]">({item.variantSnap})</span></span>
              <span className="shrink-0">{formatRupiah(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-bold">
          <span>Total Pembayaran</span>
          <span>{formatRupiah(order.total)}</span>
        </div>
      </div>

      <div className="card-sh mt-4 p-5">
        <h2 className="font-display text-xl uppercase">Instruksi Pembayaran</h2>
        {isDevMode ? (
          <p className="mt-3 text-sm text-muted">
            Mode development: payment gateway belum dikonfigurasi. Pesanan tetap tersimpan. Setel MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY untuk mengaktifkan Snap.
          </p>
        ) : canPay ? (
          <>
            <p className="mt-3 text-sm text-muted">Klik tombol di bawah untuk memilih metode pembayaran (VA, e-wallet, QRIS) melalui Midtrans Snap.</p>
            <div className="mt-5">
              <SnapPayment token={order.paymentToken!} orderId={order.id} />
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">Pesanan ini tidak menunggu pembayaran.</p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/akun/pesanan/${order.id}`} className="btn-outline">Lihat Detail Pesanan</Link>
          <Link href="/" className="text-[11px] font-bold uppercase tracking-widest text-accent">Belanja Lagi</Link>
        </div>
      </div>
    </section>
  );
}
