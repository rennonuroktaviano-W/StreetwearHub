import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/seller-guard";
import { SellerProductForm } from "@/components/seller-product-form";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { seller } = await requireSeller();
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findFirst({
      where: { id, sellerId: seller.id },
      include: {
        variants: { orderBy: { position: "asc" } },
        images: { orderBy: { position: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Katalog</p>
        <h2 className="font-display text-3xl uppercase">Edit Produk</h2>
        <p className="mt-1 text-sm text-muted">{product.name}</p>
      </div>
      <SellerProductForm
        productId={product.id}
        categories={categories}
        brands={brands}
        initial={{
          name: product.name,
          description: product.description,
          categoryId: product.categoryId ?? "",
          brandId: product.brandId ?? "",
          status: product.status,
          variants: product.variants.map((v: { id: string; size: string; color: string; sku: string; price: number; stock: number }) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
          })),
          images: product.images.map((image: { id: string; url: string; alt: string | null; position: number }) => ({
            id: image.id,
            url: image.url,
            alt: image.alt ?? "",
            position: image.position,
          })),
        }}
      />
    </div>
  );
}
