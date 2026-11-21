import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/auth-reset-form";

type Props = { params: Promise<{ token: string }> };

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  return (
    <AuthShell title="Password Baru" subtitle="Masukkan password baru untuk akun kamu.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
