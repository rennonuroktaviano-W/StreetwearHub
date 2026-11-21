import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { cancelOrderAction } from "@/app/actions/order";
import { ORDER_STATUS_LABEL } from "@/lib/order";

export default async function PesananPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun/pesanan");

  await prisma.order.updateMany({
    where: { buyerId: user.id, status: "MENUNGGU_PEMBAYARAN", expiresAt: { lt: new Date() } },
    data: { status: "DIBATALKAN", canceledAt: new Date() },
  });

  const orders = await prisma.order.findMany({
    where: { buyerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <Link href="/akun" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent">← Akun Saya</Link>
      <h1 className="font-display mt-4 text-5xl uppercase md:text-6xl">Pesanan Saya</h1>
      <p className="mt-3 text-sm text-muted">Pantau status dan riwayat pesanan kamu.</p>

      {orders.length === 0 ? (
        <div className="card-sh mt-8 p-12 text-center">
          <p className="text-sm text-muted">Belum ada pesanan.</p>
          <Link href="/shop" className="btn-outline mt-6">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="card-sh">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <p className="text-xs text-muted">{order.createdAt.toLocaleDateString("id-ID", { dateStyle: "long" })}</p>
                  <p className="font-bold tracking-wide">{order.orderNumber}</p>
                </div>
                <span className={`border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${order.status === "DIBATALKAN" ? "border-muted text-muted" : "border-accent text-accent"}`}>
                  {ORDER_STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{item.productNameSnap}</p>
                      <p className="text-xs text-muted">{item.variantSnap} · {item.quantity} pcs</p>
                      {item.trackingNumber ? <p className="mt-1 text-xs text-accent">Resi: {item.trackingNumber}</p> : null}
                    </div>
                    <p className="shrink-0 font-semibold">{formatRupiah(item.subtotal)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4">
                <div>
                  <p className="label-sh">Total</p>
                  <p className="text-lg font-bold">{formatRupiah(order.total)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {order.status === "MENUNGGU_PEMBAYARAN" ? (
                    <form action={cancelOrderAction}>
                      <input type="hidden" name="id" value={order.id} />
                      <button type="submit" className="btn-outline">Batalkan Pesanan</button>
                    </form>
                  ) : null}
                  <Link href={`/akun/pesanan/${order.id}`} className="btn-accent">Detail</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
