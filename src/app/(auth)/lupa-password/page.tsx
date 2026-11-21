import { cookies } from "next/headers";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/auth-forgot-form";
import Link from "next/link";

export const instant = false;

type Props = { searchParams: Promise<{ sent?: string }> };

export default async function LupaPasswordPage({ searchParams }: Props) {
  const { sent } = await searchParams;
  const store = await cookies();
  const devToken = process.env.SMTP_URL ? undefined : store.get("sh_reset_dev_token")?.value;

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Kami akan mengirim tautan reset ke email kamu."
      footer={
        <Link href="/login" className="font-bold text-accent hover:underline">
          ← Kembali ke masuk
        </Link>
      }
    >
      {sent === "1" ? (
        <p role="status" className="mb-5 border border-line bg-ink p-3 text-sm text-muted">
          Jika email terdaftar, tautan reset sudah dikirim. {devToken ? "Token tersedia di bawah untuk mode pengembangan ( berlaku 10 menit )." : "Silakan ceka kotak masuk kamu."}
        </p>
      ) : null}
      <ForgotPasswordForm devToken={devToken} />
    </AuthShell>
  );
}
