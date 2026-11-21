import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireSeller(options?: { allowPending?: boolean }) {
  const user = await getSessionUser();
  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    redirect("/403");
  }

  const seller = user.seller ?? (await prisma.seller.findUnique({ where: { userId: user.id } }));
  if (!seller) {
    redirect("/seller/daftar");
  }

  if (seller.status !== "APPROVED" && !(options?.allowPending && seller.status === "PENDING")) {
    redirect("/seller/daftar");
  }

  return { user, seller };
}

export function isUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) return false;
  return (error as { code?: unknown }).code === "P2002";
}
