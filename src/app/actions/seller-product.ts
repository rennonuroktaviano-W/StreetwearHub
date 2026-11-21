"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/utils";
import { isUniqueConstraintError, requireSeller } from "@/lib/seller-guard";
import { revalidateCatalog } from "@/lib/utils";

const statusSchema = z.enum(["DRAFT", "ACTIVE", "HIDDEN"]);

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().trim().min(1, "Ukuran wajib diisi").max(30),
  color: z.string().trim().min(1, "Warna wajib diisi").max(40),
  sku: z.string().trim().min(1, "SKU wajib diisi").max(60),
  price: z.coerce.number().int().nonnegative("Harga tidak valid"),
  stock: z.coerce.number().int().nonnegative("Stok tidak valid"),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().url("URL gambar tidak valid"),
  alt: z.string().trim().max(120).optional().default(""),
  position: z.coerce.number().int().nonnegative(),
});

const productSchema = z.object({
  name: z.string().trim().min(2, "Nama produk minimal 2 karakter").max(120),
  description: z.string().trim().min(1, "Deskripsi wajib diisi").max(5000),
  categoryId: z.string().trim().optional().default(""),
  brandId: z.string().trim().optional().default(""),
  status: statusSchema,
  images: z.array(imageSchema).max(8, "Maksimal 8 gambar"),
  variants: z.array(variantSchema).min(1, "Minimal 1 varian"),
});

export type ActionResult = { ok: boolean; error?: string };

function parsePayload(formData: FormData): z.infer<typeof productSchema> | null {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;
  try {
    const extra = JSON.parse(raw) as { variants?: unknown; images?: unknown };
    return productSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId") ?? "",
      brandId: formData.get("brandId") ?? "",
      status: formData.get("status"),
      variants: extra.variants,
      images: extra.images,
    });
  } catch {
    return null;
  }
}

function refreshProductPaths() {
  revalidatePath("/seller");
  revalidatePath("/seller/produk");
  revalidatePath("/seller/stok");
  revalidateCatalog();
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  const { seller } = await requireSeller();
  const data = parsePayload(formData);
  if (!data) return { ok: false, error: "Data produk tidak valid. Periksa kembali form." };

  try {
    await prisma.product.create({
      data: {
        sellerId: seller.id,
        name: data.name,
        slug: uniqueSlug(data.name),
        description: data.description,
        categoryId: data.categoryId || null,
        brandId: data.brandId || null,
        status: data.status,
        publishedAt: data.status === "ACTIVE" ? new Date() : null,
        images: {
          create: data.images.map((image, i) => ({ url: image.url, alt: image.alt || null, position: i })),
        },
        variants: {
          create: data.variants.map((variant, i) => ({
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            position: i,
          })),
        },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "SKU sudah digunakan. Silakan gunakan SKU yang berbeda." };
    }
    return { ok: false, error: "Gagal menyimpan produk. Coba lagi." };
  }

  refreshProductPaths();
  redirect("/seller/produk");
}

export async function updateProductAction(formData: FormData): Promise<ActionResult> {
  const { seller } = await requireSeller();
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { ok: false, error: "Produk tidak ditemukan." };

  const existing = await prisma.product.findFirst({ where: { id: productId, sellerId: seller.id } });
  if (!existing) return { ok: false, error: "Produk tidak ditemukan." };

  const data = parsePayload(formData);
  if (!data) return { ok: false, error: "Data produk tidak valid. Periksa kembali form." };

  try {
    await prisma.$transaction(async (tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$extends">) => {
      await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId || null,
          brandId: data.brandId || null,
          status: data.status,
          publishedAt:
            data.status === "ACTIVE" && !existing.publishedAt ? new Date() : existing.publishedAt,
        },
      });

      const keepImageIds = data.images.map((image) => image.id).filter((id): id is string => Boolean(id));
      await tx.productImage.deleteMany({ where: { productId, id: { notIn: keepImageIds } } });
      for (const [i, image] of data.images.entries()) {
        if (image.id) {
          await tx.productImage.update({
            where: { id: image.id },
            data: { url: image.url, alt: image.alt || null, position: i },
          });
        } else {
          await tx.productImage.create({
            data: { productId, url: image.url, alt: image.alt || null, position: i },
          });
        }
      }

      const keepVariantIds = data.variants.map((variant) => variant.id).filter((id): id is string => Boolean(id));
      await tx.productVariant.deleteMany({ where: { productId, id: { notIn: keepVariantIds } } });
      for (const [i, variant] of data.variants.entries()) {
        const values = {
          size: variant.size,
          color: variant.color,
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          position: i,
        };
        if (variant.id) {
          await tx.productVariant.update({ where: { id: variant.id }, data: values });
        } else {
          await tx.productVariant.create({ data: { productId, ...values } });
        }
      }
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "SKU sudah digunakan. Silakan gunakan SKU yang berbeda." };
    }
    return { ok: false, error: "Gagal menyimpan produk. Coba lagi." };
  }

  refreshProductPaths();
  redirect("/seller/produk");
}

export async function deleteProductAction(formData: FormData): Promise<ActionResult> {
  const { seller } = await requireSeller();
  const productId = String(formData.get("productId") ?? "");
  const product = await prisma.product.findFirst({
    where: { id: productId, sellerId: seller.id },
    select: { id: true },
  });
  if (!product) return { ok: false, error: "Produk tidak ditemukan." };

  await prisma.product.delete({ where: { id: product.id } });
  refreshProductPaths();
  return { ok: true };
}

export async function toggleProductStatusAction(formData: FormData): Promise<ActionResult> {
  const { seller } = await requireSeller();
  const productId = String(formData.get("productId") ?? "");
  const product = await prisma.product.findFirst({ where: { id: productId, sellerId: seller.id } });
  if (!product) return { ok: false, error: "Produk tidak ditemukan." };

  const nextStatus = product.status === "ACTIVE" ? "HIDDEN" : "ACTIVE";
  await prisma.product.update({
    where: { id: product.id },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === "ACTIVE" && !product.publishedAt ? new Date() : product.publishedAt,
    },
  });

  refreshProductPaths();
  return { ok: true };
}

const stockSchema = z.array(
  z.object({
    id: z.string().min(1),
    stock: z.coerce.number().int().nonnegative("Stok tidak valid"),
  }),
);

export async function bulkUpdateStockAction(formData: FormData): Promise<ActionResult> {
  const { seller } = await requireSeller();
  const raw = formData.get("stocks");
  if (typeof raw !== "string") return { ok: false, error: "Data stok tidak valid." };

  let entries: z.infer<typeof stockSchema>;
  try {
    entries = stockSchema.parse(JSON.parse(raw));
  } catch {
    return { ok: false, error: "Data stok tidak valid." };
  }

  const ids = entries.map((entry) => entry.id);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: ids }, product: { sellerId: seller.id } },
    select: { id: true },
  });
  if (variants.length !== ids.length) return { ok: false, error: "Sebagian varian tidak ditemukan." };

  await prisma.$transaction(
    entries.map((entry) =>
      prisma.productVariant.update({ where: { id: entry.id }, data: { stock: entry.stock } }),
    ),
  );

  refreshProductPaths();
  return { ok: true };
}
