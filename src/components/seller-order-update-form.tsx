"use client";

import { useActionState } from "react";
import { updateSellerOrderAction, type OrderActionResult } from "@/app/actions/seller-order";

export function SellerOrderUpdateForm({ itemId }: { itemId: string }) {
  const [state, action, pending] = useActionState<OrderActionResult, FormData>(
    (_state, formData) => updateSellerOrderAction(formData),
    { ok: true },
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      {!state.ok && state.error && (
        <p role="alert" className="w-full border border-accent bg-accent/10 p-3 text-sm text-accent">{state.error}</p>
      )}
      {state.ok && (
        <p role="status" className="w-full border border-line p-3 text-sm text-muted">Status pesanan diperbarui.</p>
      )}
      <input type="hidden" name="itemId" value={itemId} />
      <div>
        <label className="label-sh" htmlFor={`status-${itemId}`}>Status</label>
        <select id={`status-${itemId}`} name="status" className="input-sh" defaultValue="DIKEMAS">
          <option value="DIKEMAS">Dikemas</option>
          <option value="DIKIRIM">Dikirim</option>
        </select>
      </div>
      <div className="min-w-48 flex-1">
        <label className="label-sh" htmlFor={`resi-${itemId}`}>Nomor Resi (wajib saat dikirim)</label>
        <input id={`resi-${itemId}`} name="trackingNumber" className="input-sh" maxLength={100} placeholder="Contoh: JP0123456789" />
      </div>
      <button type="submit" className="btn-accent" disabled={pending}>{pending ? "Menyimpan..." : "Update"}</button>
    </form>
  );
}
