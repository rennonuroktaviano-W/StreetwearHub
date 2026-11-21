"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FilterOptions } from "@/lib/catalog-types";

export function CatalogFilter({
  categories,
  brands,
  sizes,
  colors,
  basePath = "/shop",
}: {
  categories: FilterOptions["categories"];
  brands: FilterOptions["brands"];
  sizes: string[];
  colors: string[];
  basePath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  const current = useCallback((key: string) => params.getAll(key), [params]);

  const update = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      next.delete("page");
      const query = next.toString();
      startTransition(() => router.push(query ? `${basePath}?${query}` : basePath, { scroll: false }));
    },
    [basePath, params, router],
  );

  const setSingle = (key: string, value: string) =>
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

  const toggle = (key: string, value: string) =>
    update((p) => {
      const values = p.getAll(key);
      p.delete(key);
      const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      next.forEach((v) => p.append(key, v));
    });

  const activeCount =
    current("category").length +
    current("brand").length +
    current("size").length +
    current("color").length +
    (params.get("minPrice") ? 1 : 0) +
    (params.get("maxPrice") ? 1 : 0);

  const btn = (active: boolean) =>
    `border px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
      active ? "border-accent bg-accent text-white" : "border-line text-muted hover:border-paper hover:text-paper"
    }`;

  return (
    <div className={`space-y-6 ${pending ? "opacity-70" : ""}`}>
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h2 className="font-display text-xl uppercase">Filter</h2>
        {activeCount > 0 && (
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
            onClick={() =>
              update((p) => {
                ["category", "brand", "size", "color", "minPrice", "maxPrice"].forEach((key) => p.delete(key));
              })
            }
          >
            Hapus ({activeCount})
          </button>
        )}
      </div>

      <fieldset className="border-b border-line pb-5">
        <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-paper">Kategori</legend>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
            <input type="radio" name="category" className="accent-accent" checked={!current("category").length} onChange={() => setSingle("category", "")} />
            Semua kategori
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
              <input type="radio" name="category" className="accent-accent" checked={current("category").includes(category.slug)} onChange={() => setSingle("category", category.slug)} />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-b border-line pb-5">
        <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-paper">Brand</legend>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
            <input type="radio" name="brand" className="accent-accent" checked={!current("brand").length} onChange={() => setSingle("brand", "")} />
            Semua brand
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
              <input type="radio" name="brand" className="accent-accent" checked={current("brand").includes(brand.slug)} onChange={() => setSingle("brand", brand.slug)} />
              {brand.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-b border-line pb-5">
        <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-paper">Ukuran</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button key={size} type="button" onClick={() => toggle("size", size)} aria-pressed={current("size").includes(size)} className={btn(current("size").includes(size))}>
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-b border-line pb-5">
        <legend className="mb-3 text-[11px] font-bold uppercase tracking-widest text-paper">Warna</legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button key={color} type="button" onClick={() => toggle("color", color)} aria-pressed={current("color").includes(color)} className={btn(current("color").includes(color))}>
              {color}
            </button>
          ))}
        </div>
      </fieldset>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          update((p) => {
            if (minPrice.trim()) p.set("minPrice", minPrice.trim());
            else p.delete("minPrice");
            if (maxPrice.trim()) p.set("maxPrice", maxPrice.trim());
            else p.delete("maxPrice");
          });
        }}
      >
        <label className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-paper">Rentang Harga (IDR)</label>
        <div className="flex items-center gap-2">
          <input className="input-sh" name="minPrice" type="number" min={0} inputMode="numeric" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span className="text-muted">–</span>
          <input className="input-sh" name="maxPrice" type="number" min={0} inputMode="numeric" placeholder="Maks" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <button type="submit" className="btn-outline mt-3 w-full py-3">Terapkan</button>
      </form>
    </div>
  );
}
