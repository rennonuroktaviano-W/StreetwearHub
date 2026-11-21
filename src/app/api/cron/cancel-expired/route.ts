import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await prisma.order.updateMany({
    where: {
      status: "MENUNGGU_PEMBAYARAN",
      expiresAt: { lt: new Date() },
    },
    data: { status: "DIBATALKAN", canceledAt: new Date() },
  });

  revalidatePath("/akun/pesanan");
  revalidatePath("/seller/pesanan");
  return Response.json({ canceled: result.count, at: new Date().toISOString() });
}
