import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressForm } from "@/components/address-form";
import { AddressList } from "@/components/address-list";

export const instant = false;

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function AlamatPage({ searchParams }: Props) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun/alamat");
  const { saved } = await searchParams;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href="/akun" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-accent">← Akun Saya</Link>
      <h1 className="font-display mt-4 text-5xl uppercase md:text-6xl">Daftar Alamat</h1>
      <p className="mt-3 text-sm text-muted">Kelola alamat pengiriman untuk checkout lebih cepat.</p>
      {saved === "1" ? (
        <p role="status" className="mt-6 border border-line bg-ink p-3 text-sm text-muted">Alamat berhasil disimpan.</p>
      ) : null}
      <div className="mt-8">
        <AddressForm />
      </div>
      <div className="mt-8 space-y-4">
        <AddressList addresses={addresses} />
      </div>
    </section>
  );
}
