import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, hashToken } from "@/lib/session-token";

const PROTECTED = [/^\/produk\//, /^\/keranjang(\/|$)/, /^\/checkout(\/|$)/, /^\/akun(\/|$)/];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((pattern) => pattern.test(pathname))) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const { prisma } = await import("@/lib/prisma");
    const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) } });
    if (session && session.expiresAt > new Date()) return NextResponse.next();
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/produk/:path*", "/keranjang/:path*", "/checkout/:path*", "/akun/:path*"],
};
