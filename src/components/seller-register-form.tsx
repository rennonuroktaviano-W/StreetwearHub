"use client";

import { useActionState } from "react";
import { becomeSellerAction } from "@/app/actions/auth";
import { TextField } from "@/components/auth-field";
import { initialAuthState } from "@/components/auth-types";

export function SellerRegisterForm() {
  const [state, formAction, pending] = useActionState(becomeSellerAction, initialAuthState);

  return (
    <form action={formAction} className="card-sh space-y-5 p-6 sm:p-8" noValidate>
      {state.error ? (
        <p role="alert" aria-live="polite" className="border border-accent/50 bg-accent/10 p-3 text-sm text-accent">
          {state.error}
        </p>
      ) : null}
      <TextField id="storeName" name="storeName" label="Nama Toko" placeholder="Contoh: Urban Kits" required error={state.fieldErrors?.storeName} />
      <div>
        <label htmlFor="description" className="label-sh">Deskripsi Toko</label>
        <textarea id="description" name="description" rows={4} placeholder="Ceritakan tentang brand dan produk yang kamu jual…" aria-invalid={state.fieldErrors?.description ? true : undefined} aria-describedby={state.fieldErrors?.description ? "description-error" : undefined} className="input-sh" required />
        {state.fieldErrors?.description?.length ? (
          <p id="description-error" role="alert" className="mt-1 text-xs text-accent">{state.fieldErrors.description[0]}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="verification" className="label-sh">Data Verifikasi</label>
        <textarea id="verification" name="verification" rows={3} placeholder="Nama pemilik, Nomor KTP/SIUP, dan kontak yang bisa diverifikasi admin…" aria-invalid={state.fieldErrors?.verification ? true : undefined} aria-describedby={state.fieldErrors?.verification ? "verification-error" : undefined} className="input-sh" required />
        {state.fieldErrors?.verification?.length ? (
          <p id="verification-error" role="alert" className="mt-1 text-xs text-accent">{state.fieldErrors.verification[0]}</p>
        ) : null}
      </div>
      <p className="text-xs text-muted">Pengajuan akan ditinjau admin. Status toko awal: <span className="font-bold text-accent">PENDING</span>.</p>
      <button type="submit" disabled={pending} className="btn-accent w-full disabled:opacity-60">
        {pending ? "Mengirim…" : "Kirim Pengajuan Seller"}
      </button>
    </form>
  );
}
