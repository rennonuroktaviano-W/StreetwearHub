import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/seller-guard";

export default async function SellerDashboardPage() {
  const { seller } = await requireSeller();

  const [productCount, stockAgg, newOrders, lowStockProducts, recentOrders] = await Promise.all([
    prisma.product.count({ where: { sellerId: seller.id } }),
    prisma.productVariant.aggregate({
      where: { product: { sellerId: seller.id } },
      _sum: { stock: true },
    }),
    prisma.order.count({
      where: {
        items: { some: { sellerId: seller.id } },
        status: { in: ["DIBAYAR", "DIKEMAS"] },
      },
    }),
    prisma.product.findMany({
      where: {
        sellerId: seller.id,
        status: "ACTIVE",
        variants: { some: { stock: { lt: 5 } } },
      },
      select: { id: true, name: true, variants: { select: { stock: true } } },
      take: 5,
    }),
    prisma.order.findMany({
      where: { items: { some: { sellerId: seller.id } } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          where: { sellerId: seller.id },
          select: { quantity: true },
        },
      },
    }),
  ]);

  const stats = [
    { label: "Total Produk", value: productCount, href: "/seller/produk" },
    { label: "Total Stok", value: stockAgg._sum.stock ?? 0, href: "/seller/stok" },
    { label: "Pesanan Baru", value: newOrders, href: "/seller/pesanan" },
    { label: "Stok Rendah", value: lowStockProducts.length, href: "/seller/stok" },
  ];

  return (
    <div className="space-y-10">
      <section aria-label="Ringkasan toko" className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-[#0f0f0f] p-5 transition hover:bg-[#151515]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="mt-3 font-display text-4xl text-paper">{stat.value}</p>
          </Link>
        ))}
      </section>

      <section aria-labelledby="low-stock-title" className="card-sh p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="low-stock-title" className="font-display text-2xl uppercase">Stok Rendah</h2>
          <Link href="/seller/stok" className="text-[11px] font-bold uppercase tracking-widest text-accent">Kelola</Link>
        </div>
        {lowStockProducts.length === 0 ? (
          <p className="border border-dashed border-line p-8 text-center text-sm text-muted">Semua stok dalam kondisi aman.</p>
        ) : (
          <ul className="divide-y divide-line">
            {lowStockProducts.map((product: { id: string; name: string; variants: { stock: number }[] }) => {
              const total = product.variants.reduce((sum: number, v: { stock: number }) => sum + v.stock, 0);
              return (
                <li key={product.id} className="flex items-center justify-between gap-4 py-3">
                  <Link href={`/seller/produk/${product.id}`} className="text-sm hover:text-accent">{product.name}</Link>
                  <span className="shrink-0 text-xs font-bold uppercase text-accent">{total} tersisa</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="orders-title" className="card-sh p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="orders-title" className="font-display text-2xl uppercase">Pesanan Terbaru</h2>
          <Link href="/seller/pesanan" className="text-[11px] font-bold uppercase tracking-widest text-accent">Lihat Semua</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="border border-dashed border-line p-8 text-center text-sm text-muted">Belum ada pesanan masuk.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recentOrders.map((order: { id: string; orderNumber: string; status: string; createdAt: Date; items: { quantity: number }[] }) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <Link href={`/seller/pesanan/${order.id}`} className="text-sm font-bold hover:text-accent">
                    {order.orderNumber}
                  </Link>
                  <p className="text-[11px] text-muted">
                    {order.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)} item · {order.createdAt.toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-accent">{order.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
