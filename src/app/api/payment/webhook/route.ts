import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type MidtransPayload = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
};

function verifySignature(payload: MidtransPayload, serverKey: string): boolean {
  if (!payload.order_id || !payload.status_code || !payload.gross_amount || !payload.signature_key) {
    return false;
  }
  const expected = createHash("sha512")
    .update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`)
    .digest("hex");
  const received = payload.signature_key;
  if (expected.length !== received.length) return false;
  let difference = 0;
  for (let i = 0; i < expected.length; i += 1) {
    difference |= expected.charCodeAt(i) ^ received.charCodeAt(i);
  }
  return difference === 0;
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return Response.json({ error: "gateway not configured" }, { status: 503 });

  let payload: MidtransPayload;
  try {
    payload = (await request.json()) as MidtransPayload;
  } catch {
    return Response.json({ error: "invalid payload" }, { status: 400 });
  }

  if (!verifySignature(payload, serverKey)) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  const success =
    payload.transaction_status === "settlement" ||
    (payload.transaction_status === "capture" && payload.fraud_status === "accept");
  const failed = payload.transaction_status === "expire" || payload.transaction_status === "cancel";

  if (!payload.order_id) return Response.json({ error: "missing order_id" }, { status: 400 });

  if (!success && !failed) return Response.json({ received: true, status: "ignored" });

  if (failed) {
    await prisma.order.updateMany({
      where: { orderNumber: payload.order_id, status: "MENUNGGU_PEMBAYARAN" },
      data: { status: "DIBATALKAN", canceledAt: new Date() },
    });
    await prisma.payment.updateMany({
      where: { transactionId: payload.transaction_id ?? "__none__" },
      data: { status: payload.transaction_status ?? "cancel" },
    });
    revalidatePath("/akun/pesanan");
    return Response.json({ received: true, status: "canceled" });
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { orderNumber: payload.order_id },
          include: { items: true },
        });
        if (!order) return { status: "not_found" as const };
        if (order.status !== "MENUNGGU_PEMBAYARAN") return { status: "already_processed" as const };

        const variantIds = order.items.map((item) => item.variantId);
        const variants = await tx.productVariant.findMany({ where: { id: { in: variantIds } } });
        const variantMap = new Map(variants.map((v) => [v.id, v]));

        for (const item of order.items) {
          const variant = variantMap.get(item.variantId);
          if (!variant || variant.stock < item.quantity) {
            throw new Error("insufficient stock");
          }
        }

        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
          await tx.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: "DIBAYAR", paidAt: new Date() },
        });

        const payment = await tx.payment.findFirst({ where: { orderId: order.id }, orderBy: { createdAt: "desc" } });
        if (payment) {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: payload.transaction_status ?? "settlement",
              transactionId: payload.transaction_id ?? payment.transactionId,
              method: payload.payment_type ?? payment.method,
              payload: payload as object,
            },
          });
        } else {
          await tx.payment.create({
            data: {
              orderId: order.id,
              provider: "midtrans",
              transactionId: payload.transaction_id ?? null,
              method: payload.payment_type ?? null,
              amount: order.total,
              status: payload.transaction_status ?? "settlement",
              payload: payload as object,
            },
          });
        }

        return { status: "processed" as const, orderId: order.id };
      },
      { isolationLevel: "Serializable" },
    );

    revalidatePath("/akun/pesanan");
    revalidatePath("/seller/pesanan");
    if (result.status === "processed") revalidatePath(`/akun/pesanan/${result.orderId}`);
    return Response.json({ received: true, result: result.status });
  } catch {
    return Response.json({ error: "processing failed" }, { status: 500 });
  }
}
