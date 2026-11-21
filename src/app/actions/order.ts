"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function cancelOrderAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/akun/pesanan");

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const order = await prisma.order.findFirst({ where: { id, buyerId: user.id } });
  if (!order || order.status !== "MENUNGGU_PEMBAYARAN") return;

  await prisma.order.update({
    where: { id },
    data: { status: "DIBATALKAN", canceledAt: new Date() },
  });

  revalidatePath("/akun/pesanan");
  revalidatePath(`/akun/pesanan/${id}`);
}
