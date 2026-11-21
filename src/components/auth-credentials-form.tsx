"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "@/app/actions/auth";
import { TextField } from "@/components/auth-field";
import { initialAuthState } from "@/components/auth-types";

type Mode = "login" | "register";

export function AuthCredentialsForm({ mode, next }: { mode: Mode; next?: string }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initialAuthState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.error ? (
        <p role="alert" aria-live="polite" className="border border-accent/50 bg-accent/10 p-3 text-sm text-accent">
          {state.error}
        </p>
      ) : null}

      {mode === "register" ? (
        <TextField id="name" name="name" label="Nama Lengkap" autoComplete="name" placeholder="Nama kamu" required error={state.fieldErrors?.name} />
      ) : null}

      <TextField id="email" name="email" label="Email" type="email" autoComplete="email" placeholder="nama@email.com" required error={state.fieldErrors?.email} />
      <TextField id="password" name="password" label="Password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Minimal 8 karakter" required minLength={8} error={state.fieldErrors?.password} />

      {mode === "login" ? (
        <div className="text-right">
          <Link href="/lupa-password" className="text-xs font-semibold text-accent hover:underline">
            Lupa password?
          </Link>
        </div>
      ) : null}

      <button type="submit" disabled={pending} className="btn-accent w-full disabled:opacity-60">
        {pending ? "Memproses…" : mode === "login" ? "Masuk" : "Buat Akun"}
      </button>
    </form>
  );
}
