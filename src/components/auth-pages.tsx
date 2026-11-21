import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { AuthCredentialsForm } from "@/components/auth-credentials-form";

export function LoginPageBody({ next, reset }: { next?: string; reset?: boolean }) {
  return (
    <AuthShell
      title="Masuk"
      subtitle="Lanjutkan ke akun StreetwearHub kamu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="font-bold text-accent hover:underline">
            Daftar sekarang
          </Link>
        </>
      }
    >
      {reset ? (
        <p role="status" className="mb-5 border border-line bg-ink p-3 text-sm text-muted">
          Password berhasil diperbarui. Silakan masuk dengan password baru kamu.
        </p>
      ) : null}
      <AuthCredentialsForm mode="login" next={next} />
    </AuthShell>
  );
}

export function RegisterPageBody({ next }: { next?: string }) {
  return (
    <AuthShell
      title="Daftar"
      subtitle="Buat akun untuk belanja dan jadi seller."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-bold text-accent hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <AuthCredentialsForm mode="register" next={next} />
    </AuthShell>
  );
}
