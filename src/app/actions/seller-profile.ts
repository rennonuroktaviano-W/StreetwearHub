"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/seller-guard";

const schema = z.object({
  name: z.string().trim().min(2, "Nama toko minimal 2 karakter").max(100),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(2000),
  logoUrl: z.string().trim(),
  bannerUrl: z.string().trim(),
});

export type ProfileActionResult = { ok: boolean; error?: string };

function optionalUrl(value: string): string | null {
  if (!value) return null;
  const parsed = z.string().url().safeParse(value);
  return parsed.success ? value : null;
}

export async function updateShopProfileAction(formData: FormData): Promise<ProfileActionResult> {
  const { seller } = await requireSeller({ allowPending: true });

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      logoUrl: formData.get("logoUrl") ?? "",
      bannerUrl: formData.get("bannerUrl") ?? "",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: error.issues[0]?.message ?? "Data profil tidak valid." };
    }
    return { ok: false, error: "Data profil tidak valid." };
  }

  await prisma.seller.update({
    where: { id: seller.id },
    data: {
      name: data.name,
      description: data.description,
      logoUrl: optionalUrl(data.logoUrl),
      bannerUrl: optionalUrl(data.bannerUrl),
    },
  });

  revalidatePath("/seller");
  revalidatePath("/seller/profil");
  revalidatePath(`/toko/${seller.slug}`);
  return { ok: true };
}
