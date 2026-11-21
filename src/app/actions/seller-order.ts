"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/seller-guard";

const schema = z.object({
  itemId: z.string().min(1),
  status: z.enum(["DIKEMAS", "DIKIRIM"]),
  trackingNumber: z.string().trim().max(100).optional().default(""),
});

export type OrderActionResult = { ok: boolean; error?: string };

export async function updateSellerOrderAction(formData: FormData): Promise<OrderActionResult> {
  const { seller } = await requireSeller();

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse({
      itemId: formData.get("itemId"),
      status: formData.get("status"),
      trackingNumber: formData.get("trackingNumber") ?? "",
    });
  } catch {
    return { ok: false, error: "Data pesanan tidak valid." };
  }

  const item = await prisma.orderItem.findFirst({
    where: { id: input.itemId, sellerId: seller.id },
    include: { order: { select: { status: true } } },
  });
  if (!item) return { ok: false, error: "Item pesanan tidak ditemukan." };

  if (item.order.status === "DIBATALKAN" || item.order.status === "SELESAI") {
    return { ok: false, error: "Status pesanan tidak dapat diubah lagi." };
  }

  if (input.status === "DIKEMAS" && item.trackingNumber && item.shippedAt) {
    return { ok: false, error: "Pesanan ini sudah dikirim." };
  }

  if (input.status === "DIKIRIM" && !input.trackingNumber) {
    return { ok: false, error: "Nomor resi wajib diisi saat mengirim." };
  }

  await prisma.$transaction(async (tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$extends">) => {
    await tx.orderItem.update({
      where: { id: item.id },
      data: {
        ...(input.status === "DIKIRIM" ? { trackingNumber: input.trackingNumber, shippedAt: new Date() } : {}),
      },
    });
    if (item.order.status === "DIBAYAR" || item.order.status === "DIKEMAS") {
      await tx.order.update({
        where: { id: item.orderId },
        data: { status: input.status },
      });
    }
  });

  revalidatePath("/seller/pesanan");
  revalidatePath(`/seller/pesanan/${item.orderId}`);
  revalidatePath("/seller");
  return { ok: true };
}
