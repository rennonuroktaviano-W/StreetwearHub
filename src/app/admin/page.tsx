import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";

export const instant = false;

export default async function AdminDashboardPage() {
  const [sellersPending, sellersApproved, products, categories, brands, ordersPaid, revenue] = await Promise.all([
    prisma.seller.count({ where: { status: "PENDING" } }),
    prisma.seller.count({ where: { status: "APPROVED" } }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.order.count({ where: { status: { in: ["DIBAYAR", "DIKEMAS", "DIKIRIM", "SELESAI"] } } }),
    prisma.order.aggregate({
      where: { status: { in: ["DIBAYAR", "DIKEMAS", "DIKIRIM", "SELESAI"] } },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    { label: "Seller Pending", value: sellersPending, href: "/admin/sellers" },
    { label: "Seller Aktif", value: sellersApproved, href: "/admin/sellers" },
    { label: "Total Produk", value: products, href: "/admin/produk" },
    { label: "Kategori", value: categories, href: "/admin/kategori" },
    { label: "Brand", value: brands, href: "/admin/brand" },
    { label: "Pesanan Dibayar", value: ordersPaid, href: "/" },
  ];

  return (
    <div className="space-y-10">
      <section aria-label="Ringkasan platform" className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-[#0f0f0f] p-5 transition hover:bg-[#151515]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{stat.label}</p>
            <p className="mt-3 font-display text-4xl text-paper">{stat.value}</p>
          </Link>
        ))}
      </section>
      <section className="card-sh p-5 md:p-6">
        <p className="label-sh">Total Transaksi Dibayar</p>
        <p className="font-display text-4xl text-accent">{formatRupiah(revenue._sum.total ?? 0)}</p>
      </section>
    </div>
  );
}
