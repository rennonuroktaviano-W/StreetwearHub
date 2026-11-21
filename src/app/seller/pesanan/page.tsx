import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { requireSeller } from "@/lib/seller-guard";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SellerOrdersPage({ searchParams }: Props) {
  const { seller } = await requireSeller();
  const query = await searchParams;
  const raw = Array.isArray(query.status) ? query.status[0] : query.status;
  const statuses = ["DIBAYAR", "DIKEMAS", "DIKIRIM", "SELESAI"] as const;
  const status = statuses.find((item) => item === raw);

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { sellerId: seller.id } },
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      items: {
        where: { sellerId: seller.id },
        select: { quantity: true, subtotal: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Penjualan</p>
        <h2 className="font-display text-3xl uppercase">Pesanan Masuk</h2>
      </div>

      <nav aria-label="Filter status pesanan" className="flex flex-wrap gap-2">
        <Link href="/seller/pesanan" aria-current={!status ? "page" : undefined} className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${!status ? "border-accent bg-accent text-white" : "border-line text-muted"}`}>Semua</Link>
        {statuses.map((item) => (
          <Link key={item} href={`/seller/pesanan?status=${item}`} aria-current={status === item ? "page" : undefined} className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${status === item ? "border-accent bg-accent text-white" : "border-line text-muted"}`}>{item}</Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <div className="card-sh p-12 text-center text-sm text-muted">Belum ada pesanan.</div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order: { id: string; orderNumber: string; status: string; createdAt: Date; items: { quantity: number; subtotal: number }[] }) => {
            const sellerSubtotal = order.items.reduce((sum: number, item: { subtotal: number }) => sum + item.subtotal, 0);
            return (
              <li key={order.id} className="card-sh flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <Link href={`/seller/pesanan/${order.id}`} className="font-bold hover:text-accent">{order.orderNumber}</Link>
                  <p className="text-xs text-muted">
                    {order.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)} item toko kamu · {formatRupiah(sellerSubtotal)} · {order.createdAt.toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span className="border border-line px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">{order.status}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
