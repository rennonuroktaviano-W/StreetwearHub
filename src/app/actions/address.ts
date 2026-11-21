"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import type { AuthState } from "@/components/auth-types";

const addressSchema = z.object({
  label: z.string().trim().min(1, "Label wajib diisi").max(40),
  recipient: z.string().trim().min(1, "Nama penerima wajib diisi").max(80),
  phone: z.string().trim().min(8, "Nomor telepon tidak valid").max(20),
  province: z.string().trim().min(1, "Provinsi wajib diisi").max(60),
  city: z.string().trim().min(1, "Kota wajib diisi").max(60),
  district: z.string().trim().min(1, "Kecamatan wajib diisi").max(60),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Kode pos harus 5 angka"),
  detail: z.string().trim().min(1, "Alamat lengkap wajib diisi").max(500),
  isDefault: z.coerce.boolean().optional().default(false),
});

function fromForm(formData: FormData) {
  return addressSchema.safeParse({
    label: formData.get("label"),
    recipient: formData.get("recipient"),
    phone: formData.get("phone"),
    province: formData.get("province"),
    city: formData.get("city"),
    district: formData.get("district"),
    postalCode: formData.get("postalCode"),
    detail: formData.get("detail"),
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
  });
}

async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun/alamat");
  return user;
}

export async function createAddressAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await requireUser();
  const parsed = fromForm(formData);
  if (!parsed.success) {
    return { error: "Periksa kembali data alamat.", fieldErrors: z.flattenError(parsed.error).fieldErrors as AuthState["fieldErrors"] };
  }

  await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }
    const count = await tx.address.count({ where: { userId: user.id } });
    await tx.address.create({
      data: { ...parsed.data, userId: user.id, isDefault: parsed.data.isDefault || count === 0 },
    });
  });

  revalidatePath("/akun/alamat");
  redirect("/akun/alamat?saved=1");
}

export async function updateAddressAction(
  id: string,
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await requireUser();
  const parsed = fromForm(formData);
  if (!parsed.success) {
    return { error: "Periksa kembali data alamat.", fieldErrors: z.flattenError(parsed.error).fieldErrors as AuthState["fieldErrors"] };
  }
  const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!existing) return { error: "Alamat tidak ditemukan." };

  await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }
    await tx.address.update({ where: { id }, data: parsed.data });
  });

  revalidatePath("/akun/alamat");
  redirect("/akun/alamat?saved=1");
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const address = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!address) return;
  await prisma.address.delete({ where: { id } });
  if (address.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  revalidatePath("/akun/alamat");
}

export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const address = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!address) return;
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }),
    prisma.address.update({ where: { id }, data: { isDefault: true } }),
  ]);
  revalidatePath("/akun/alamat");
}
