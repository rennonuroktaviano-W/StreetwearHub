"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { formatRupiah } from "@/lib/constants";

export type PurchaseVariant = {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
};

export function ProductPurchasePanel({
  productId,
  productName,
  productSlug,
  image,
  sellerName,
  sellerSlug,
  variants,
  onColorChange,
}: {
  productId: string;
  productName: string;
  productSlug: string;
  image: string | null;
  sellerName: string;
  sellerSlug: string;
  variants: PurchaseVariant[];
  onColorChange?: (color: string | null) => void;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedId, setSelectedId] = useState<string | null>(variants.find((v) => v.stock > 0)?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);
  const selected = variants.find((v) => v.id === selectedId) ?? null;
  const soldOut = variants.every((v) => v.stock <= 0);
  const maxStock = selected?.stock ?? 0;

  const size = selected?.size ?? null;
  const color = selected?.color ?? null;

  useEffect(() => {
    onColorChange?.(color);
  }, [color, onColorChange]);

  const pickVariant = (nextSize: string | null, nextColor: string | null) => {
    const match = variants.find((v) => v.size === nextSize && v.color === nextColor && v.stock > 0);
    if (match) {
      setSelectedId(match.id);
      setNotice("");
    } else {
      setSelectedId(null);
      setNotice("Kombinasi ukuran dan warna ini sedang habis.");
    }
    setQuantity(1);
  };

  const addToCart = (redirect: boolean) => {
    if (!selected || selected.stock <= 0) {
      setNotice("Pilih varian yang masih tersedia terlebih dahulu.");
      return;
    }
    addItem(
      {
        variantId: selected.id,
        productId,
        productName,
        productSlug,
        variantName: `${selected.size} / ${selected.color}`,
        price: selected.price,
        maxStock: selected.stock,
        image,
        sellerName,
        sellerSlug,
      },
      quantity,
    );
    setNotice("Berhasil ditambahkan ke keranjang.");
    if (redirect) router.push("/keranjang");
  };

  const isSizeAvailable = (value: string) =>
    variants.some((v) => v.size === value && v.color === color && v.stock > 0);
  const isColorAvailable = (value: string) =>
    variants.some((v) => v.color === value && v.size === size && v.stock > 0);

  return (
    <div className="card-sh p-5 md:p-6">
      <div className="mb-5">
        <span className="label-sh">Ukuran</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((value) => {
            const available = isSizeAvailable(value);
            const active = size === value;
            return (
              <button
                key={value}
                type="button"
                disabled={!available}
                aria-pressed={active}
                onClick={() => pickVariant(value, color)}
                className={`min-w-12 border px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "border-accent bg-accent text-white"
                    : available
                      ? "border-line hover:border-paper"
                      : "cursor-not-allowed border-line text-muted line-through opacity-50"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <span className="label-sh">Warna</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((value) => {
            const available = isColorAvailable(value);
            const active = color === value;
            return (
              <button
                key={value}
                type="button"
                disabled={!available}
                aria-pressed={active}
                onClick={() => pickVariant(size, value)}
                className={`border px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "border-accent bg-accent text-white"
                    : available
                      ? "border-line hover:border-paper"
                      : "cursor-not-allowed border-line text-muted line-through opacity-50"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <span className="label-sh">Jumlah</span>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            className="h-10 w-10 border border-line text-lg hover:border-accent disabled:opacity-40"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
            disabled={quantity <= 1}
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold" aria-live="polite">{quantity}</span>
          <button
            type="button"
            className="h-10 w-10 border border-line text-lg hover:border-accent disabled:opacity-40"
            onClick={() => setQuantity((n) => Math.min(maxStock, n + 1))}
            disabled={quantity >= maxStock || maxStock <= 0}
            aria-label="Tambah jumlah"
          >
            +
          </button>
          <span className="text-xs text-muted">
            {selected ? `${maxStock} tersedia` : "Pilih varian"}
          </span>
        </div>
      </div>

      <div className="mb-4 border-t border-line pt-4">
        <span className="label-sh">Harga satuan</span>
        <p className="font-display text-3xl text-accent">
          {selected ? formatRupiah(selected.price) : "—"}
        </p>
      </div>

      {notice && <p className="mb-3 text-xs text-accent" role="status">{notice}</p>}

      {soldOut ? (
        <p className="btn-outline w-full cursor-not-allowed border-[#333] text-muted">SOLD OUT</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="btn-outline" onClick={() => addToCart(false)} disabled={!selected}>
            Tambah ke Keranjang
          </button>
          <button type="button" className="btn-accent" onClick={() => addToCart(true)} disabled={!selected}>
            Beli Sekarang
          </button>
        </div>
      )}
    </div>
  );
}
