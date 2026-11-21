import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { cancelOrderAction } from "@/app/actions/order";
import { formatAddress, ORDER_STATUS_LABEL, parseAddressSnapshot } from "@/lib/order";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function DetailPesananPage({ params }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun/pesanan");
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, buyerId: user.id },
    include: { items: true, payments: true },
  });
  if (!order) notFound();

  const address = parseAddressSnapshot(order.addressSnapshot);
  const statusLabel = ORDER_STATUS_LABEL[order.status] ?? order.status;

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href="/akun/pesanan" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent">← Kembali ke Pesanan</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Detail Pesanan</p>
          <h1 className="font-display mt-2 text-4xl uppercase md:text-5xl">{order.orderNumber}</h1>
        </div>
        <span className={`border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${order.status === "DIBATALKAN" ? "border-muted text-muted" : "border-accent text-accent"}`}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted">
        Dibuat {order.createdAt.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
        {order.paidAt ? ` · Dibayar ${order.paidAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}` : ""}
        {order.canceledAt ? ` · Dibatalkan ${order.canceledAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}` : ""}
      </p>

      <div className="card-sh mt-8 p-5">
        <h2 className="font-display text-2xl uppercase">Alamat Pengiriman</h2>
        <p className="mt-3 text-sm font-semibold">{address.recipient ?? "-"}</p>
        <p className="text-sm text-muted">{address.phone ?? "-"}</p>
        <p className="mt-1 break-words text-sm text-muted">{formatAddress(address) || "Alamat tidak tersedia."}</p>
      </div>

      <div className="card-sh mt-4 p-5">
        <h2 className="font-display text-2xl uppercase">Item Pesanan</h2>
        <div className="mt-4 divide-y divide-line">
          {order.items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0">
              <div className="min-w-0 flex gap-3">
                {item.imageSnap ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageSnap} alt="" className="h-16 w-16 shrink-0 border border-line object-cover" />
                ) : null}
                <div className="min-w-0">
                  <p className="font-semibold">{item.productNameSnap}</p>
                  <p className="text-xs text-muted">{item.variantSnap}</p>
                  <p className="text-xs text-muted">{item.quantity} × {formatRupiah(item.priceSnap)}</p>
                  {item.trackingNumber ? (
                    <p className="mt-2 text-xs font-bold text-accent">No. Resi: {item.trackingNumber}</p>
                  ) : null}
                </div>
              </div>
              <p className="font-semibold">{formatRupiah(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
          <div className="flex justify-between text-muted"><span>Ongkir</span><span>{formatRupiah(order.shippingCost)}</span></div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><span>Total</span><span>{formatRupiah(order.total)}</span></div>
        </div>
      </div>

      {order.payments.length > 0 ? (
        <div className="card-sh mt-4 p-5">
          <h2 className="font-display text-2xl uppercase">Pembayaran</h2>
          <div className="mt-3 space-y-2 text-sm">
            {order.payments.map((payment) => (
              <div key={payment.id} className="flex justify-between gap-4">
                <span className="text-muted">{payment.provider} · {payment.method ?? "-"} · {payment.status}</span>
                <span>{formatRupiah(payment.amount)}</span>
              </div>
            ))}
          </div>
          {order.paymentUrl ? (
            <a href={order.paymentUrl} target="_blank" rel="noreferrer" className="btn-outline mt-4">Lanjutkan Pembayaran</a>
          ) : null}
        </div>
      ) : null}

      {order.status === "MENUNGGU_PEMBAYARAN" ? (
        <form action={cancelOrderAction} className="mt-6">
          <input type="hidden" name="id" value={order.id} />
          <button type="submit" className="btn-outline">Batalkan Pesanan</button>
        </form>
      ) : null}
    </section>
  );
}
