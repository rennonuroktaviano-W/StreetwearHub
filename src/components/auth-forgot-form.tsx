"use client";

import { useActionState } from "react";
import { requestResetAction } from "@/app/actions/auth";
import { TextField } from "@/components/auth-field";
import { initialAuthState } from "@/components/auth-types";

export function ForgotPasswordForm({ devToken }: { devToken?: string }) {
  const [state, formAction, pending] = useActionState(requestResetAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error ? (
        <p role="alert" aria-live="polite" className="border border-accent/50 bg-accent/10 p-3 text-sm text-accent">
          {state.error}
        </p>
      ) : null}
      <TextField id="email" name="email" label="Email Terdaftar" type="email" autoComplete="email" placeholder="nama@email.com" required error={state.fieldErrors?.email} />
      <button type="submit" disabled={pending} className="btn-accent w-full disabled:opacity-60">
        {pending ? "Mengirim…" : "Kirim Tautan Reset"}
      </button>
      {devToken ? (
        <div className="border border-line bg-ink p-4 text-sm" role="status">
          <p className="label-sh">Mode pengembangan</p>
          <p className="text-muted">Email tidak dikirim (SMTP_URL belum disetel). Token reset kamu:</p>
          <LinkToken token={devToken} />
        </div>
      ) : null}
    </form>
  );
}

function LinkToken({ token }: { token: string }) {
  return (
    <a
      href={`/reset-password/${token}`}
      className="mt-2 block break-all font-mono text-xs text-accent underline"
    >
      /reset-password/{token}
    </a>
  );
}
