"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify, uniqueSlug } from "@/lib/utils";

export type AdminActionResult = { ok: boolean; error?: string };

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

function idFrom(formData: FormData): string | null {
  const value = formData.get("id");
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function approveSellerAction(formData: FormData): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { ok: false, error: "ID seller tidak valid." };

  const seller = await prisma.seller.findUnique({ where: { id } });
  if (!seller) return { ok: false, error: "Seller tidak ditemukan." };

  await prisma.$transaction([
    prisma.seller.update({
      where: { id },
      data: { status: "APPROVED", reviewedBy: admin.id, reviewedAt: new Date(), rejectionNote: null },
    }),
    prisma.user.update({ where: { id: seller.userId }, data: { role: "SELLER" } }),
  ]);

  revalidatePath("/admin/sellers");
  revalidatePath("/admin");
  revalidateCatalogPaths();
  return { ok: true };
}

export async function rejectSellerAction(formData: FormData): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { ok: false, error: "ID seller tidak valid." };
  const note = typeof formData.get("note") === "string" ? String(formData.get("note")).slice(0, 500) : null;

  await prisma.seller.update({
    where: { id },
    data: { status: "REJECTED", reviewedBy: admin.id, reviewedAt: new Date(), rejectionNote: note },
  });

  revalidatePath("/admin/sellers");
  revalidatePath("/admin");
  return { ok: true };
}

export async function disableSellerAction(formData: FormData): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { ok: false, error: "ID seller tidak valid." };

  await prisma.$transaction([
    prisma.seller.update({
      where: { id },
      data: { status: "DISABLED", reviewedBy: admin.id, reviewedAt: new Date() },
    }),
    prisma.product.updateMany({ where: { sellerId: id, status: "ACTIVE" }, data: { status: "HIDDEN" } }),
  ]);

  revalidatePath("/admin/sellers");
  revalidatePath("/admin");
  revalidateCatalogPaths();
  return { ok: true };
}

const taxonomySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(500).optional().default(""),
  imageUrl: z.union([z.url(), z.literal("")]).optional().default(""),
});

function taxonomyFromForm(formData: FormData) {
  return taxonomySchema.safeParse({
    id: idFrom(formData) ?? undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") ?? formData.get("logoUrl") ?? "",
  });
}

function toNullable(value: string): string | null {
  return value.length > 0 ? value : null;
}

export async function saveCategoryAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = taxonomyFromForm(formData);
  if (!parsed.success) return { ok: false, error: "Periksa kembali data kategori." };

  const { id, name, description, imageUrl } = parsed.data;
  const slug = slugify(parsed.data.slug || name) || uniqueSlug(name);
  const duplicate = await prisma.category.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) } });
  if (duplicate) return { ok: false, error: "Slug kategori sudah dipakai." };

  const data = { name, slug, description: toNullable(description), imageUrl: toNullable(imageUrl) };
  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/admin/kategori");
  revalidateCatalogPaths();
  return { ok: true };
}

export async function deleteCategoryAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { ok: false, error: "ID kategori tidak valid." };
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategori");
  revalidateCatalogPaths();
  return { ok: true };
}

export async function saveBrandAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = taxonomyFromForm(formData);
  if (!parsed.success) return { ok: false, error: "Periksa kembali data brand." };

  const { id, name, description } = parsed.data;
  const imageUrl = toNullable(
    typeof formData.get("logoUrl") === "string" ? String(formData.get("logoUrl")) : (parsed.data.imageUrl ?? ""),
  );
  const slug = slugify(parsed.data.slug || name) || uniqueSlug(name);
  const duplicate = await prisma.brand.findFirst({ where: { slug, ...(id ? { id: { not: id } } : {}) } });
  if (duplicate) return { ok: false, error: "Slug brand sudah dipakai." };

  const data = { name, slug, description: toNullable(description), logoUrl: imageUrl };
  if (id) {
    await prisma.brand.update({ where: { id }, data });
  } else {
    await prisma.brand.create({ data });
  }

  revalidatePath("/admin/brand");
  revalidateCatalogPaths();
  return { ok: true };
}

export async function deleteBrandAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const id = idFrom(formData);
  if (!id) return { ok: false, error: "ID brand tidak valid." };
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/brand");
  revalidateCatalogPaths();
  return { ok: true };
}

const moderateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["MODERATED", "ACTIVE"]),
});

export async function moderateProductAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = moderateSchema.safeParse({ id: idFrom(formData), status: formData.get("status") });
  if (!parsed.success) return { ok: false, error: "Data moderasi tidak valid." };

  await prisma.product.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });

  revalidatePath("/admin/produk");
  revalidateCatalogPaths();
  return { ok: true };
}

function revalidateCatalogPaths() {
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function approveSellerFormAction(formData: FormData): Promise<void> {
  await approveSellerAction(formData);
}

export async function rejectSellerFormAction(formData: FormData): Promise<void> {
  await rejectSellerAction(formData);
}

export async function disableSellerFormAction(formData: FormData): Promise<void> {
  await disableSellerAction(formData);
}

export async function deleteCategoryFormAction(formData: FormData): Promise<void> {
  await deleteCategoryAction(formData);
}

export async function deleteBrandFormAction(formData: FormData): Promise<void> {
  await deleteBrandAction(formData);
}

export async function moderateProductFormAction(formData: FormData): Promise<void> {
  await moderateProductAction(formData);
}
