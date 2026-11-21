import { requireSeller } from "@/lib/seller-guard";
import { prisma } from "@/lib/prisma";
import { StockForm } from "@/components/stock-form";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function SellerStockPage({ searchParams }: Props) {
  const { seller } = await requireSeller();
  const query = await searchParams;
  const raw = Array.isArray(query.filter) ? query.filter[0] : query.filter;
  const filter = raw === "low" || raw === "out" ? raw : "all";

  const variants = await prisma.productVariant.findMany({
    where: {
      product: { sellerId: seller.id },
      ...(filter === "low" ? { stock: { gte: 1, lt: 5 } } : filter === "out" ? { stock: 0 } : {}),
    },
    orderBy: [{ stock: "asc" }, { product: { name: "asc" } }],
    select: {
      id: true,
      sku: true,
      size: true,
      color: true,
      stock: true,
      productId: true,
      product: { select: { name: true } },
    },
  });

  const [lowCount, outCount] = await Promise.all([
    prisma.productVariant.count({ where: { product: { sellerId: seller.id }, stock: { gte: 1, lt: 5 } } }),
    prisma.productVariant.count({ where: { product: { sellerId: seller.id }, stock: 0 } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Inventaris</p>
        <h2 className="font-display text-3xl uppercase">Kelola Stok</h2>
      </div>

      <nav aria-label="Filter stok" className="flex flex-wrap gap-2">
        {[
          { key: "all", label: `Semua (${variants.length})` },
          { key: "low", label: `Stok Rendah (${lowCount})` },
          { key: "out", label: `Habis (${outCount})` },
        ].map((item) => (
          <a
            key={item.key}
            href={item.key === "all" ? "/seller/stok" : `/seller/stok?filter=${item.key}`}
            aria-current={filter === item.key ? "page" : undefined}
            className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
              filter === item.key ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-paper"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {lowCount > 0 && (
        <p role="status" className="border border-accent bg-accent/10 p-3 text-sm text-accent">
          {lowCount} varian memiliki stok di bawah 5. Segera perbarui.
        </p>
      )}

      {variants.length === 0 ? (
        <div className="card-sh p-12 text-center text-sm text-muted">Tidak ada varian pada filter ini.</div>
      ) : (
        <StockForm
          rows={variants.map((v: { id: string; sku: string; size: string; color: string; stock: number; productId: string; product: { name: string } }) => ({
            id: v.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            stock: v.stock,
            productId: v.productId,
            productName: v.product.name,
          }))}
        />
      )}
    </div>
  );
}
