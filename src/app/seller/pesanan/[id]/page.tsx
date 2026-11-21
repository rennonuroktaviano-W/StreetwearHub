import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/constants";
import { requireSeller } from "@/lib/seller-guard";
import { SellerOrderUpdateForm } from "@/components/seller-order-update-form";

type Props = { params: Promise<{ id: string }> };

export default async function SellerOrderDetailPage({ params }: Props) {
  const { seller } = await requireSeller();
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, items: { some: { sellerId: seller.id } } },
    include: {
      items: { where: { sellerId: seller.id }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  const address = order.addressSnapshot as Record<string, unknown>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Pesanan</p>
        <h2 className="font-display text-3xl uppercase">{order.orderNumber}</h2>
        <p className="mt-1 text-sm text-muted">
          {order.status} · Dibuat {order.createdAt.toLocaleString("id-ID")}
        </p>
      </div>

      <section className="card-sh p-5 md:p-6" aria-labelledby="items-title">
        <h3 id="items-title" className="mb-4 font-display text-xl uppercase">Item Toko Kamu</h3>
        <ul className="divide-y divide-line">
          {order.items.map((item: { id: string; productNameSnap: string; variantSnap: string; imageSnap: string | null; priceSnap: number; quantity: number; subtotal: number; trackingNumber: string | null; shippedAt: Date | null }) => (
            <li key={item.id} className="space-y-4 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 border border-line bg-[#151515]">
                  {item.imageSnap && (
                    <Image src={item.imageSnap} alt="" fill sizes="64px" className="object-cover" unoptimized />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.productNameSnap}</p>
                  <p className="text-xs text-muted">{item.variantSnap} · {item.quantity} × {formatRupiah(item.priceSnap)}</p>
                  <p className="mt-1 text-sm font-bold text-accent">{formatRupiah(item.subtotal)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <p className="text-xs text-muted">
                  {item.trackingNumber ? `Resi: ${item.trackingNumber}` : "Belum ada nomor resi"}
                  {item.shippedAt ? ` · Dikirim ${item.shippedAt.toLocaleDateString("id-ID")}` : ""}
                </p>
                {(order.status === "DIBAYAR" || order.status === "DIKEMAS") && (
                  <SellerOrderUpdateForm itemId={item.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-sh p-5 md:p-6" aria-labelledby="ship-title">
        <h3 id="ship-title" className="mb-3 font-display text-xl uppercase">Alamat Pengiriman</h3>
        <p className="text-sm text-muted">
          {[address.recipient, address.phone, address.detail, address.district, address.city, address.province, address.postalCode]
            .filter(Boolean)
            .join(", ")}
        </p>
      </section>
    </div>
  );
}
