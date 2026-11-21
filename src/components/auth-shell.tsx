import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-5 py-14">
      <div className="w-full max-w-md">
        <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.35em] text-accent">
          {SITE_NAME} / AKUN
        </p>
        <h1 className="font-display text-5xl uppercase leading-none text-center md:text-6xl">
          {title}
        </h1>
        <p className="mt-3 text-center text-sm text-muted">{subtitle}</p>
        <div className="card-sh mt-8 p-6 sm:p-8">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
