"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SORTS } from "@/lib/catalog-types";
import type { SortKey } from "@/lib/catalog-types";

const labels: Record<SortKey, string> = {
  newest: "Terbaru",
  "price-asc": "Harga Terendah",
  "price-desc": "Harga Tertinggi",
  "best-selling": "Terlaris",
};

export function CatalogToolbar({ basePath = "/shop" }: { basePath?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const push = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      next.delete("page");
      const query = next.toString();
      startTransition(() => router.push(query ? `${basePath}?${query}` : basePath, { scroll: false }));
    },
    [basePath, params, router],
  );

  return (
    <div className={`card-sh mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center ${pending ? "opacity-70" : ""}`}>
      <form
        className="flex flex-1 gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          push((p) => {
            const value = q.trim();
            if (value) p.set("q", value);
            else p.delete("q");
          });
        }}
      >
        <label className="sr-only" htmlFor="shop-search">Cari produk</label>
        <input
          id="shop-search"
          className="input-sh"
          placeholder="Cari nama produk, brand, atau toko..."
          value={q}
          onChange={(event) => setQ(event.target.value)}
          maxLength={100}
        />
        <button type="submit" className="btn-outline shrink-0 px-5">Cari</button>
      </form>

      <div className="flex items-center gap-3">
        <label className="label-sh mb-0 shrink-0" htmlFor="shop-sort">Urutkan</label>
        <select
          id="shop-sort"
          className="input-sh md:w-52"
          value={params.get("sort") ?? "newest"}
          onChange={(event) =>
            push((p) => {
              const value = event.target.value;
              if (value === "newest") p.delete("sort");
              else p.set("sort", value);
            })
          }
        >
          {SORTS.map((sort) => (
            <option key={sort} value={sort}>{labels[sort]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
