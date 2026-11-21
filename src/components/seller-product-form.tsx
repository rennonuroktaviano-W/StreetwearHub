"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProductAction, updateProductAction, type ActionResult } from "@/app/actions/seller-product";

export type VariantRow = {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price: number | string;
  stock: number | string;
};

export type ImageRow = { id?: string; url: string; alt: string; position: number };

type Props = {
  productId?: string;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  initial?: {
    name: string;
    description: string;
    categoryId: string;
    brandId: string;
    status: "DRAFT" | "ACTIVE" | "HIDDEN" | "MODERATED";
    variants: VariantRow[];
    images: ImageRow[];
  };
};

const emptyVariant = (): VariantRow => ({ size: "", color: "", sku: "", price: 0, stock: 0 });
const emptyImage = (position: number): ImageRow => ({ url: "", alt: "", position });

export function SellerProductForm({ productId, categories, brands, initial }: Props) {
  const [variants, setVariants] = useState<VariantRow[]>(initial?.variants.length ? initial.variants : [emptyVariant()]);
  const [images, setImages] = useState<ImageRow[]>(initial?.images.length ? initial.images : [emptyImage(0)]);
  const action = productId ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    (_state, formData) => action(formData),
    { ok: true },
  );

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    setVariants((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateImage(index: number, patch: Partial<ImageRow>) {
    setImages((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((rows) => {
      const target = index + direction;
      if (target < 0 || target >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((row, i) => ({ ...row, position: i }));
    });
  }

  const payload = JSON.stringify({
    variants,
    images: images
      .filter((image) => image.url.trim() !== "")
      .map((image, i) => ({ ...image, position: i })),
  });

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="payload" value={payload} />
      {!state.ok && state.error && (
        <p role="alert" className="border border-accent bg-accent/10 p-3 text-sm text-accent">{state.error}</p>
      )}

      <fieldset className="card-sh space-y-5 p-5 md:p-6">
        <legend className="px-1 font-display text-xl uppercase">Informasi Produk</legend>
        <div>
          <label className="label-sh" htmlFor="name">Nama Produk</label>
          <input id="name" name="name" className="input-sh" defaultValue={initial?.name} required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="label-sh" htmlFor="description">Deskripsi</label>
          <textarea id="description" name="description" className="input-sh min-h-32" defaultValue={initial?.description} required maxLength={5000} />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="label-sh" htmlFor="categoryId">Kategori</label>
            <select id="categoryId" name="categoryId" className="input-sh" defaultValue={initial?.categoryId ?? ""}>
              <option value="">Tanpa kategori</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sh" htmlFor="brandId">Brand</label>
            <select id="brandId" name="brandId" className="input-sh" defaultValue={initial?.brandId ?? ""}>
              <option value="">Tanpa brand</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-sh" htmlFor="status">Status</label>
            <select id="status" name="status" className="input-sh" defaultValue={initial?.status === "MODERATED" ? "DRAFT" : initial?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="card-sh space-y-4 p-5 md:p-6">
        <legend className="px-1 font-display text-xl uppercase">Galeri Gambar (Maks. 8)</legend>
        {images.map((image, index) => (
          <div key={image.id ?? `new-${index}`} className="grid gap-3 border border-line p-3 md:grid-cols-[1fr_1fr_auto_auto_auto]">
            <input
              aria-label={`URL gambar ${index + 1}`}
              className="input-sh"
              placeholder="https://.../gambar.jpg"
              value={image.url}
              onChange={(event) => updateImage(index, { url: event.target.value })}
            />
            <input
              aria-label={`Alt gambar ${index + 1}`}
              className="input-sh"
              placeholder="Deskripsi gambar"
              value={image.alt}
              maxLength={120}
              onChange={(event) => updateImage(index, { alt: event.target.value })}
            />
            <button type="button" className="btn-outline px-3 py-2 text-[10px]" disabled={index === 0} onClick={() => moveImage(index, -1)} aria-label={`Naikkan gambar ${index + 1}`}>↑</button>
            <button type="button" className="btn-outline px-3 py-2 text-[10px]" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} aria-label={`Turunkan gambar ${index + 1}`}>↓</button>
            <button type="button" className="border border-accent px-3 py-2 text-[10px] font-bold uppercase text-accent" onClick={() => setImages((rows) => rows.filter((_, i) => i !== index))} aria-label={`Hapus gambar ${index + 1}`}>×</button>
          </div>
        ))}
        <button
          type="button"
          className="btn-outline text-[10px]"
          disabled={images.length >= 8}
          onClick={() => setImages((rows) => [...rows, emptyImage(rows.length)])}
        >
          + Tambah Gambar
        </button>
      </fieldset>

      <fieldset className="card-sh space-y-4 p-5 md:p-6">
        <legend className="px-1 font-display text-xl uppercase">Varian</legend>
        {variants.map((variant, index) => (
          <div key={variant.id ?? `new-${index}`} className="grid gap-3 border border-line p-3 md:grid-cols-6">
            <input aria-label={`Ukuran varian ${index + 1}`} className="input-sh" placeholder="Ukuran" value={variant.size} maxLength={30} required onChange={(event) => updateVariant(index, { size: event.target.value })} />
            <input aria-label={`Warna varian ${index + 1}`} className="input-sh" placeholder="Warna" value={variant.color} maxLength={40} required onChange={(event) => updateVariant(index, { color: event.target.value })} />
            <input aria-label={`SKU varian ${index + 1}`} className="input-sh" placeholder="SKU" value={variant.sku} maxLength={60} required onChange={(event) => updateVariant(index, { sku: event.target.value })} />
            <input aria-label={`Harga varian ${index + 1}`} className="input-sh" type="number" min={0} value={variant.price} required onChange={(event) => updateVariant(index, { price: event.target.value })} />
            <input aria-label={`Stok varian ${index + 1}`} className="input-sh" type="number" min={0} value={variant.stock} required onChange={(event) => updateVariant(index, { stock: event.target.value })} />
            <button type="button" className="border border-accent px-3 py-2 text-[10px] font-bold uppercase text-accent" disabled={variants.length === 1} onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))} aria-label={`Hapus varian ${index + 1}`}>Hapus</button>
          </div>
        ))}
        <button type="button" className="btn-outline text-[10px]" onClick={() => setVariants((rows) => [...rows, emptyVariant()])}>+ Tambah Varian</button>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-accent" disabled={pending}>{pending ? "Menyimpan..." : productId ? "Simpan Perubahan" : "Buat Produk"}</button>
        <Link href="/seller/produk" className="btn-outline">Batal</Link>
      </div>
    </form>
  );
}
