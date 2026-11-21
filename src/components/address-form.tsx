"use client";

import { useActionState, useState } from "react";
import { createAddressAction, updateAddressAction } from "@/app/actions/address";
import { initialAuthState } from "@/components/auth-types";

type AddressValues = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
  isDefault: boolean;
};

const fields: { name: keyof AddressValues; label: string; placeholder: string }[] = [
  { name: "label", label: "Label Alamat", placeholder: "Rumah, Kantor, Kost…" },
  { name: "recipient", label: "Nama Penerima", placeholder: "Nama lengkap" },
  { name: "phone", label: "No. Telepon", placeholder: "08xxxxxxxxxx" },
  { name: "province", label: "Provinsi", placeholder: "DKI Jakarta" },
  { name: "city", label: "Kota", placeholder: "Jakarta Selatan" },
  { name: "district", label: "Kecamatan", placeholder: "Tebet" },
  { name: "postalCode", label: "Kode Pos", placeholder: "12345" },
  { name: "detail", label: "Alamat Lengkap", placeholder: "Jl. Contoh No. 12, RT/RW…" },
];

export function AddressForm({ address }: { address?: AddressValues }) {
  const isEdit = Boolean(address?.id);
  const action = isEdit ? updateAddressAction.bind(null, address!.id) : createAddressAction;
  const [state, formAction, pending] = useActionState(action, initialAuthState);
  const [open, setOpen] = useState(!isEdit);

  const inputClass = "input-sh";

  return (
    <div className="card-sh">
      {!isEdit ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold uppercase tracking-widest hover:text-accent"
        >
          {open ? "Tutup Form" : "+ Tambah Alamat Baru"}
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-bold hover:text-accent"
        >
          Edit {address?.label}
          <span aria-hidden>{open ? "−" : "Edit"}</span>
        </button>
      )}

      {open ? (
        <form action={formAction} className="space-y-4 border-t border-line p-5" noValidate>
          {state.error ? (
            <p role="alert" className="border border-accent/50 bg-accent/10 p-3 text-sm text-accent">
              {state.error}
            </p>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => {
              const error = state.fieldErrors?.[field.name];
              const id = `${isEdit ? `edit-${address!.id}` : "new"}-${field.name}`;
              return (
                <div key={field.name} className={field.name === "detail" ? "sm:col-span-2" : undefined}>
                  <label htmlFor={id} className="label-sh">{field.label}</label>
                  <input
                    id={id}
                    name={field.name}
                    defaultValue={String(address?.[field.name] ?? "")}
                    placeholder={field.placeholder}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={inputClass}
                    required
                  />
                  {error?.length ? (
                    <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-accent">{error[0]}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault ?? false} className="h-4 w-4 accent-[#e63946]" />
            Jadikan alamat utama
          </label>
          <button type="submit" disabled={pending} className="btn-accent w-full disabled:opacity-60 sm:w-auto">
            {pending ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Simpan Alamat"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
