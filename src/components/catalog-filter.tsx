"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FilterOptions, SortKey } from "@/lib/catalog-types";
import { SORTS } from "@/lib/catalog-types";

const sortLabels: Record<SortKey, string> = {
  newest: "Terbaru",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
  "best-selling": "Terlaris",
};

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const current = useCallback(
    (key: string) => searchParams.getAll(key),
    [searchParams],
  );

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
      });
    },
    [basePath, router, searchParams],
  );

  const setSingle = (key: string, value: string) => {
    update((params) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
  };

  const toggleMulti = (key: string, value: string) => {
    update((params) => {
      const values = params.getAll(key);
      params.delete(key);
      const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      next.forEach((v) => params.append(key, v));
    });
  };

  const activeCount =
    current("category").length +
    current("brand").length +
    current("size").length +
    current("color").length +
    (searchParams.get("minPrice") ? 1 : 0) +
    (searchParams.get("maxPrice") ? 1 : 0);

  return (
    <div className={`space-y-7 ${pending ? "opacity-70" : ""}`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSingle("q", q.trim());
        }}
      >
        <label className="label-sh" htmlFor="catalog-search">Cari</label>
        <div className="flex gap-2">
          <input
            id="catalog-search"
            className="input-sh"
            placeholder="Nama produk, brand, toko..."
            value={q}
            onChange={(event) => setQ(event.target.value)}
            maxLength={100}
          />
          <button type="submit" className="btn-outline shrink-0 px-4" aria-label="Cari produk">
            Cari
          </button>
        </div>
      </form>

      <div>
        <label className="label-sh" htmlFor="catalog-sort">Urutkan</label>
        <select
          id="catalog-sort"
          className="input-sh"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(event) => setSingle("sort", event.target.value === "newest" ? "" : event.target.value)}
        >
          {SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {sortLabels[sort]}
            </option>
          ))}
        </select>
      </div>

      <details className="border-b border-line pb-5" open>
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Kategori</summary>
        <div className="mt-4 space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
            <input
              type="radio"
              name="category"
              className="accent-accent"
              checked={!current("category").length}
              onChange={() => setSingle("category", "")}
            />
            Semua kategori
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
              <input
                type="radio"
                name="category"
                className="accent-accent"
                checked={current("category").includes(category.slug)}
                onChange={() => setSingle("category", category.slug)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </details>

      <details className="border-b border-line pb-5">
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Brand</summary>
        <div className="mt-4 space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
            <input
              type="radio"
              name="brand"
              className="accent-accent"
              checked={!current("brand").length}
              onChange={() => setSingle("brand", "")}
            />
            Semua brand
          </label>
          {brands.map((brand) => (
            <label key={brand.id} className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-paper">
              <input
                type="radio"
                name="brand"
                className="accent-accent"
                checked={current("brand").includes(brand.slug)}
                onChange={() => setSingle("brand", brand.slug)}
              />
              {brand.name}
            </label>
          ))}
        </div>
      </details>

      <details className="border-b border-line pb-5">
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Ukuran</summary>
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = current("size").includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleMulti("size", size)}
                aria-pressed={active}
                className={`border px-3 py-1.5 text-xs font-bold transition ${
                  active ? "border-accent bg-accent text-white" : "border-line text-muted hover:border-paper hover:text-paper"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </details>

      <details className="border-b border-line pb-5">
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest">Warna</summary>
        <div className="mt-4 flex flex-wrap gap-2">
          {colors.map((color) => {
            const active = current("color").includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => toggleMulti("color", color)}
                aria-pressed={active}
                className={`border px-3 py-1.5 text-xs font-bold transition ${
                  active ? "border-accent bg-accent text-white" : "border-line text-muted hover:border-paper hover:text-paper"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </details>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          update((params) => {
            const min = String(data.get("minPrice") ?? "").trim();
            const max = String(data.get("maxPrice") ?? "").trim();
            if (min) params.set("minPrice", min);
            else params.delete("minPrice");
            if (max) params.set("maxPrice", max);
            else params.delete("maxPrice");
          });
        }}
      >
        <label className="label-sh">Rentang Harga (IDR)</label>
        <div className="flex items-center gap-2">
          <input
            className="input-sh"
            name="minPrice"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
          />
          <span className="text-muted">–</span>
          <input
            className="input-sh"
            name="maxPrice"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Maks"
            defaultValue={searchParams.get("maxPrice") ?? ""}
          />
        </div>
        <button type="submit" className="btn-outline mt-3 w-full py-3">Terapkan Harga</button>
      </form>

      {activeCount > 0 && (
        <button
          type="button"
          className="w-full text-center text-xs font-bold uppercase tracking-widest text-accent hover:underline"
          onClick={() => {
            const preserved = new URLSearchParams();
            const qValue = searchParams.get("q");
            const sortValue = searchParams.get("sort");
            if (qValue) preserved.set("q", qValue);
            if (sortValue) preserved.set("sort", sortValue);
            const query = preserved.toString();
            startTransition(() => router.push(query ? `${basePath}?${query}` : basePath, { scroll: false }));
          }}
        >
          Hapus semua filter ({activeCount})
        </button>
      )}

      <span className="sr-only" aria-live="polite">Halaman: {pathname}</span>
    </div>
  );
}
