"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { bulkUpdateStockAction, type ActionResult } from "@/app/actions/seller-product";

type Row = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  productName: string;
  productId: string;
};

export function StockForm({ rows }: { rows: Row[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((row) => [row.id, String(row.stock)])),
  );
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    (_state, formData) => bulkUpdateStockAction(formData),
    { ok: true },
  );

  const stocks = JSON.stringify(rows.map((row) => ({ id: row.id, stock: Number(values[row.id]) })));

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="stocks" value={stocks} />
      {!state.ok && state.error && (
        <p role="alert" className="border border-accent bg-accent/10 p-3 text-sm text-accent">{state.error}</p>
      )}
      {state.ok && (
        <p role="status" className="border border-line p-3 text-sm text-muted">Stok berhasil diperbarui.</p>
      )}
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-[#151515] text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th scope="col" className="p-3">Produk</th>
              <th scope="col" className="p-3">Varian</th>
              <th scope="col" className="p-3">SKU</th>
              <th scope="col" className="p-3">Stok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="p-3">
                  <Link href={`/seller/produk/${row.productId}`} className="hover:text-accent">{row.productName}</Link>
                </td>
                <td className="p-3">{row.size} / {row.color}</td>
                <td className="p-3 text-muted">{row.sku}</td>
                <td className="p-3">
                  <input
                    aria-label={`Stok ${row.sku}`}
                    type="number"
                    min={0}
                    className="input-sh max-w-28"
                    value={values[row.id]}
                    onChange={(event) => setValues((prev) => ({ ...prev, [row.id]: event.target.value }))}
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="submit" className="btn-accent" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Semua Stok"}</button>
    </form>
  );
}
