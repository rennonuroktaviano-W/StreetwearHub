import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/seller-guard";
import { SellerProductForm } from "@/components/seller-product-form";

export default async function NewProductPage() {
  await requireSeller();
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Katalog</p>
        <h2 className="font-display text-3xl uppercase">Produk Baru</h2>
      </div>
      <SellerProductForm categories={categories} brands={brands} />
    </div>
  );
}
