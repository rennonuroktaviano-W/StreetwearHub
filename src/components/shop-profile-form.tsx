"use client";

import { useActionState } from "react";
import { updateShopProfileAction, type ProfileActionResult } from "@/app/actions/seller-profile";

type Props = {
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  slug: string;
};

export function ShopProfileForm({ name, description, logoUrl, bannerUrl, slug }: Props) {
  const [state, action, pending] = useActionState<ProfileActionResult, FormData>(
    (_state, formData) => updateShopProfileAction(formData),
    { ok: true },
  );

  return (
    <form action={action} className="space-y-5">
      {!state.ok && state.error && (
        <p role="alert" className="border border-accent bg-accent/10 p-3 text-sm text-accent">{state.error}</p>
      )}
      {state.ok && (
        <p role="status" className="border border-line p-3 text-sm text-muted">Perubahan profil tersimpan.</p>
      )}
      <div>
        <label className="label-sh" htmlFor="shop-name">Nama Toko</label>
        <input id="shop-name" name="name" className="input-sh" defaultValue={name} required minLength={2} maxLength={100} />
      </div>
      <div>
        <label className="label-sh" htmlFor="shop-slug">Slug Toko (tidak dapat diubah)</label>
        <input id="shop-slug" className="input-sh opacity-60" value={slug} readOnly aria-readonly="true" />
      </div>
      <div>
        <label className="label-sh" htmlFor="shop-desc">Deskripsi</label>
        <textarea id="shop-desc" name="description" className="input-sh min-h-32" defaultValue={description} required minLength={10} maxLength={2000} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label-sh" htmlFor="shop-logo">URL Logo</label>
          <input id="shop-logo" name="logoUrl" type="url" className="input-sh" defaultValue={logoUrl} placeholder="https://..." />
        </div>
        <div>
          <label className="label-sh" htmlFor="shop-banner">URL Banner</label>
          <input id="shop-banner" name="bannerUrl" type="url" className="input-sh" defaultValue={bannerUrl} placeholder="https://..." />
        </div>
      </div>
      <button type="submit" className="btn-accent" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}
