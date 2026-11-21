import { prisma } from "@/lib/prisma";
import { moderateProductFormAction } from "@/app/actions/admin";

export default async function AdminProdukPage() {
  const products = await prisma.product.findMany({
    include: { seller: { select: { name: true } }, variants: { select: { price: true, stock: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <section aria-labelledby="products-title" className="space-y-6">
      <div>
        <h2 id="products-title" className="font-display text-2xl uppercase">Moderasi Produk</h2>
        <p className="mt-1 text-sm text-muted">Aktifkan produk yang sudah ditinjau atau tandai perlu moderasi.</p>
      </div>
      {products.length === 0 ? (
        <p className="card-sh p-8 text-center text-sm text-muted">Belum ada produk.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => {
            const prices = product.variants.map((v) => v.price);
            const min = prices.length ? Math.min(...prices) : 0;
            const max = prices.length ? Math.max(...prices) : 0;
            return (
              <li key={product.id} className="card-sh flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">
                    {product.seller.name} · /produk/{product.slug} · {product.status}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {min === max ? `Rp${min.toLocaleString("id-ID")}` : `Rp${min.toLocaleString("id-ID")} – Rp${max.toLocaleString("id-ID")}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.status !== "ACTIVE" ? (
                    <form action={moderateProductFormAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="status" value="ACTIVE" />
                      <button type="submit" className="btn-accent">Aktifkan</button>
                    </form>
                  ) : null}
                  {product.status !== "MODERATED" ? (
                    <form action={moderateProductFormAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="status" value="MODERATED" />
                      <button type="submit" className="btn-outline">Tandai Moderasi</button>
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
