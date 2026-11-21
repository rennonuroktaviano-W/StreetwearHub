"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import midtransClient from "midtrans-client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const checkoutItemSchema = z.object({
  variantId: z.string().min(1),
  productId: z.string().min(1),
  productName: z.string().min(1).max(200),
  productSlug: z.string().min(1).max(200),
  variantName: z.string().min(1).max(120),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().nullable().optional(),
  sellerName: z.string().min(1).max(120),
  sellerSlug: z.string().min(1).max(120),
});

const checkoutSchema = z.object({
  addressId: z.string().min(1),
  items: z.array(checkoutItemSchema).min(1, "Keranjang kosong").max(100),
});

export type CheckoutState = { error: string | null };

export async function createCheckoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/checkout");

  let raw: unknown;
  try {
    const payload = formData.get("payload");
    if (typeof payload !== "string") return { error: "Data checkout tidak valid." };
    raw = JSON.parse(payload);
  } catch {
    return { error: "Data checkout tidak valid." };
  }

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Periksa kembali alamat dan item keranjang." };
  }

  const { addressId, items } = parsed.data;
  const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
  if (!address) return { error: "Alamat tidak ditemukan." };

  const variantIds = [...new Set(items.map((item) => item.variantId))];
  const orderNumber = `SH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  type NormalizedItem = {
    variantId: string;
    productId: string;
    sellerId: string;
    productNameSnap: string;
    variantSnap: string;
    imageSnap: string | null;
    priceSnap: number;
    quantity: number;
    subtotal: number;
  };
  type CheckoutResult = { ok: true; orderId: string } | { ok: false; error: string };

  const result = await prisma.$transaction(async (tx): Promise<CheckoutResult> => {
    const variants = await tx.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { include: { seller: true, images: { orderBy: { position: "asc" }, take: 1 } } } },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));
    const normalized: NormalizedItem[] = [];

    for (const item of items) {
      const variant = variantMap.get(item.variantId);
      if (!variant || variant.productId !== item.productId) {
        return { ok: false, error: "Sebagian produk sudah tidak tersedia." };
      }
      if (variant.product.status !== "ACTIVE" || variant.product.seller.status !== "APPROVED") {
        return { ok: false, error: "Sebagian produk tidak dapat dibeli saat ini." };
      }
      if (variant.stock < item.quantity) {
        return { ok: false, error: `Stok ${variant.product.name} (${variant.size}/${variant.color}) tidak cukup. Tersisa ${variant.stock}.` };
      }
      if (variant.price !== item.price) {
        return { ok: false, error: "Harga produk berubah. Silakan perbarui keranjang." };
      }
      normalized.push({
        variantId: variant.id,
        productId: variant.productId,
        sellerId: variant.product.sellerId,
        productNameSnap: variant.product.name,
        variantSnap: `${variant.size} / ${variant.color}`,
        imageSnap: item.image ?? variant.product.images[0]?.url ?? null,
        priceSnap: variant.price,
        quantity: item.quantity,
        subtotal: variant.price * item.quantity,
      });
    }

    const subtotal = normalized.reduce((sum, item) => sum + item.subtotal, 0);
    const addressSnapshot = {
      label: address.label,
      recipient: address.recipient,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      detail: address.detail,
    };

    const order = await tx.order.create({
      data: {
        orderNumber,
        buyerId: user.id,
        status: "MENUNGGU_PEMBAYARAN",
        addressSnapshot,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        expiresAt,
        items: { create: normalized },
      },
    });
    return { ok: true, orderId: order.id };
  }, { isolationLevel: "Serializable" });

  if (!result.ok) return { error: result.error };

  const order = await prisma.order.findUniqueOrThrow({ where: { id: result.orderId } });
  const total = order.total;
  const normalized = await prisma.orderItem.findMany({ where: { orderId: order.id } });

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.MIDTRANS_CLIENT_KEY;

  if (!serverKey || !clientKey) {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "midtrans",
        transactionId: `dev-${order.orderNumber}`,
        amount: total,
        status: "pending",
        payload: { mode: "development", note: "Payment gateway belum dikonfigurasi" },
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentUrl: `/akun/pesanan/${order.id}`,
        paymentToken: `dev-${order.orderNumber}`,
      },
    });
  } else {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey,
        clientKey,
      });
      const transaction = await snap.createTransaction({
        transaction_details: { order_id: order.orderNumber, gross_amount: total },
        customer_details: {
          first_name: address.recipient,
          email: user.email,
          phone: address.phone,
          billing_address: {
            first_name: address.recipient,
            phone: address.phone,
            address: address.detail,
            city: address.city,
            postal_code: address.postalCode,
            country_code: "ID",
          },
        },
        item_details: normalized.map((item) => ({
          id: item.variantId,
          name: `${item.productNameSnap} - ${item.variantSnap}`.slice(0, 50),
          price: item.priceSnap,
          quantity: item.quantity,
        })),
      });
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { paymentToken: transaction.token, paymentUrl: transaction.redirect_url },
        }),
        prisma.payment.create({
          data: {
            orderId: order.id,
            provider: "midtrans",
            amount: total,
            status: "pending",
            payload: { token: transaction.token, redirectUrl: transaction.redirect_url },
          },
        }),
      ]);
    } catch {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: "midtrans",
          amount: total,
          status: "pending",
          payload: { mode: "development", note: "Gagal menghubungi payment gateway" },
        },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentUrl: `/akun/pesanan/${order.id}` },
      });
    }
  }

  revalidatePath("/akun/pesanan");
  redirect(`/checkout/${order.id}`);
}

export async function createCheckoutFromForm(formData: FormData): Promise<CheckoutState> {
  return createCheckoutAction({ error: null }, formData);
}
