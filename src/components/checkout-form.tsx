"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { createCheckoutAction, type CheckoutState } from "@/app/actions/checkout";
import { formatRupiah } from "@/lib/constants";
import type { AddressSnapshot } from "@/lib/order";

export type CheckoutAddress = AddressSnapshot & { id: string };

export function CheckoutForm({ addresses }: { addresses: CheckoutAddress[] }) {
  const { items, groups, total } = useCart();
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createCheckoutAction, { error: null });

  const payload = useMemo(
    () => JSON.stringify({ addressId, items }),
    [addressId, items],
  );

  if (items.length === 0) {
    return (
      <div className="card-sh p-8 text-center">
        <p className="text-sm text-muted">Keranjang kamu kosong.</p>
        <Link href="/keranjang" className="btn-outline mt-5">Lihat Keranjang</Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />
      {state.error ? (
        <p role="alert" className="border border-accent bg-accent/10 p-4 text-sm text-accent">{state.error}</p>
      ) : null}
      {addresses.length === 0 ? (
        <div className="card-sh p-5">
          <p className="text-sm text-muted">Kamu belum punya alamat. Tambahkan alamat dulu sebelum checkout.</p>
          <Link href="/akun/alamat" className="btn-outline mt-4">Tambah Alamat</Link>
        </div>
      ) : (
        <fieldset className="card-sh p-5">
          <legend className="label-sh px-1">Pilih Alamat Pengiriman</legend>
          <div className="space-y-3">
            {addresses.map((address) => (
              <label key={address.id} className="flex cursor-pointer gap-3 border border-line p-4 has-checked:border-accent">
                <input
                  type="radio"
                  name="addressChoice"
                  value={address.id}
                  checked={addressId === address.id}
                  onChange={() => setAddressId(address.id)}
                  className="mt-1 accent-accent"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{address.recipient} · {address.label}</span>
                  <span className="block text-xs text-muted">{address.phone}</span>
                  <span className="mt-1 block break-words text-xs text-muted">
                    {[address.detail, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(", ")}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="card-sh p-5">
        <h2 className="font-display text-2xl uppercase">Ringkasan Pesanan</h2>
        <div className="mt-4 divide-y divide-line">
          {groups.map((group) => (
            <div key={group.sellerSlug} className="py-3 first:pt-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{group.sellerName}</p>
              {group.items.map((item) => (
                <div key={item.key} className="mt-2 flex justify-between gap-4 text-sm">
                  <span className="min-w-0 text-muted">{item.quantity} × {item.productName} <span className="text-[11px]">({item.variantName})</span></span>
                  <span className="shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
              <p className="mt-2 text-right text-xs font-bold">Subtotal toko: {formatRupiah(group.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatRupiah(total)}</span></div>
          <div className="flex justify-between text-muted"><span>Ongkir</span><span>{formatRupiah(0)}</span></div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><span>Total</span><span>{formatRupiah(total)}</span></div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-accent w-full"
        disabled={pending || addresses.length === 0 || items.length === 0}
      >
        {pending ? "Memproses..." : "Buat Pesanan & Bayar"}
      </button>
      <p className="text-center text-[11px] text-muted">
        Stok baru dikurangi setelah pembayaran berhasil. Pesanan otomatis dibatalkan dalam 24 jam.
      </p>
    </form>
  );
}
