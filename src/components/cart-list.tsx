"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatRupiah } from "@/lib/constants";

export function CartList() {
  const { items, groups, total, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="card-sh p-8 text-center md:p-14">
        <p className="font-display text-3xl uppercase">Keranjang Kosong</p>
        <p className="mt-3 text-sm text-muted">Belum ada barang. Cari drop terbaru dulu, ya.</p>
        <Link href="/" className="btn-accent mt-6">Jelajahi Katalog</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.sellerSlug} aria-labelledby={`seller-${group.sellerSlug}`} className="card-sh p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <h2 id={`seller-${group.sellerSlug}`} className="font-display text-xl uppercase">
              {group.sellerName}
            </h2>
            <Link href={`/shop/${group.sellerSlug}`} className="text-[11px] font-bold uppercase tracking-widest text-accent">
              Kunjungi Toko
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {group.items.map((item) => (
              <li key={item.key} className="flex flex-wrap gap-4 py-4 first:pt-4">
                <Link href={`/produk/${item.productSlug}`} className="shrink-0" aria-label={item.productName}>
                  <div className="h-20 w-20 border border-line bg-[#151515]">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-xs text-muted">{item.variantName}</p>
                    </div>
                    <p className="font-bold">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center border border-line" aria-label={`Jumlah ${item.productName}`}>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm font-bold hover:text-accent disabled:opacity-40"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm font-bold hover:text-accent disabled:opacity-40"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-muted">Stok {item.maxStock}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-[11px] font-bold uppercase tracking-widest text-muted underline hover:text-accent"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-sm">
            <span className="text-muted">Subtotal toko</span>
            <span className="font-bold">{formatRupiah(group.subtotal)}</span>
          </div>
        </section>
      ))}
      <div className="card-sh flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Keseluruhan</p>
          <p className="font-display text-3xl">{formatRupiah(total)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={clear} className="btn-outline">Kosongkan</button>
          <Link href="/checkout" className="btn-accent">Lanjut Checkout</Link>
        </div>
      </div>
    </div>
  );
}
