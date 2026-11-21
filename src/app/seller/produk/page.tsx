import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { requireSeller } from "@/lib/seller-guard";
import { minPrice } from "@/lib/product";
import { ToggleStatusButton, DeleteProductButton } from "@/components/seller-product-actions";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const filters = ["ALL", "DRAFT", "ACTIVE", "HIDDEN", "MODERATED"] as const;

export default async function SellerProductsPage({ searchParams }: Props) {
  const { seller } = await requireSeller();
  const query = await searchParams;
  const raw = Array.isArray(query.status) ? query.status[0] : query.status;
  const status = filters.find((item) => item === raw) ?? "ALL";

  const products = await prisma.product.findMany({
    where: { sellerId: seller.id, ...(status === "ALL" ? {} : { status }) },
    orderBy: { updatedAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { select: { price: true, stock: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Katalog</p>
          <h2 className="font-display text-3xl uppercase">Produk Saya</h2>
        </div>
        <Link href="/seller/produk/baru" className="btn-accent">+ Produk Baru</Link>
      </div>

      <nav aria-label="Filter status produk" className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Link
            key={item}
            href={item === "ALL" ? "/seller/produk" : `/seller/produk?status=${item}`}
            aria-current={status === item ? "page" : undefined}
            className={`border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
              status === item ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-paper"
            }`}
          >
            {item}
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <div className="card-sh p-12 text-center">
          <p className="text-sm text-muted">Belum ada produk pada filter ini.</p>
          <Link href="/seller/produk/baru" className="btn-outline mt-5">Buat Produk Pertama</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((product: { id: string; name: string; status: string; images: { url: string }[]; variants: { price: number; stock: number }[] }) => {
            const stock = product.variants.reduce((sum: number, v: { stock: number }) => sum + v.stock, 0);
            return (
              <li key={product.id} className="card-sh flex flex-wrap items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 border border-line bg-[#151515]">
                  {product.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/seller/produk/${product.id}`} className="font-bold hover:text-accent">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {formatRupiah(minPrice(product.variants))} · {product.variants.length} varian · {stock} stok
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-line px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                    {product.status}
                  </span>
                  <Link href={`/seller/produk/${product.id}`} className="btn-outline px-3 py-2 text-[10px]">Edit</Link>
                  <ToggleStatusButton productId={product.id} status={product.status} />
                  <DeleteProductButton productId={product.id} name={product.name} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
