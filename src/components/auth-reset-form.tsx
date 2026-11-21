"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/app/actions/auth";
import { TextField } from "@/components/auth-field";
import { initialAuthState } from "@/components/auth-types";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <p role="alert" aria-live="polite" className="border border-accent/50 bg-accent/10 p-3 text-sm text-accent">
          {state.error}
        </p>
      ) : null}
      <TextField id="password" name="password" label="Password Baru" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" required minLength={8} error={state.fieldErrors?.password} />
      <button type="submit" disabled={pending} className="btn-accent w-full disabled:opacity-60">
        {pending ? "Menyimpan…" : "Simpan Password Baru"}
      </button>
    </form>
  );
}
