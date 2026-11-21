"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashSync, compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  generateToken,
  getSessionUser,
  hashToken,
} from "@/lib/auth";
import { uniqueSlug } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import type { AuthState } from "@/components/auth-types";

const RESET_COOKIE = "sh_reset_dev_token";
const RESET_TTL_MS = 60 * 60 * 1000;

function safeNext(value: FormDataEntryValue | null): string {
  const raw = typeof value === "string" ? value : "";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) return raw;
  return "/akun";
}

function fieldErrors(error: z.ZodError): AuthState["fieldErrors"] {
  return z.flattenError(error).fieldErrors as AuthState["fieldErrors"];
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.email("Format email tidak valid").transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password minimal 8 karakter").max(72),
});

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Periksa kembali data yang kamu isi.", fieldErrors: fieldErrors(parsed.error) };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "Email sudah terdaftar. Silakan login atau reset password." };
  }

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: hashSync(parsed.data.password, 10),
      },
    });
  } catch {
    return { error: "Gagal membuat akun. Silakan coba lagi." };
  }

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

const loginSchema = z.object({
  email: z.email("Format email tidak valid").transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Periksa kembali data yang kamu isi.", fieldErrors: fieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return { error: "Email atau password salah." };
  }

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

const requestResetSchema = z.object({
  email: z.email("Format email tidak valid").transform((v) => v.toLowerCase()),
});

export async function requestResetAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Periksa kembali data yang kamu isi.", fieldErrors: fieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: {
        tokenHash: hashToken(token),
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });

    if (process.env.SMTP_URL) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport(process.env.SMTP_URL);
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password/${token}`;
        await transporter.sendMail({
          from: process.env.SMTP_FROM ?? `no-reply@${SITE_NAME.toLowerCase()}.local`,
          to: user.email,
          subject: "Reset password StreetwearHub",
          text: `Klik tautan berikut untuk mereset password (berlaku 1 jam):\n${resetUrl}\n\nJika bukan kamu, abaikan email ini.`,
        });
      } catch {
        return { error: "Gagal mengirim email reset. Silakan coba lagi nanti." };
      }
    } else {
      const store = await cookies();
      store.set(RESET_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 10,
      });
    }
  }

  redirect("/lupa-password?sent=1");
}

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password minimal 8 karakter").max(72),
});

export async function resetPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Periksa kembali data yang kamu isi.", fieldErrors: fieldErrors(parsed.error) };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "Tautan reset tidak valid atau sudah kedaluwarsa." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: hashSync(parsed.data.password, 10) },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.deleteMany({ where: { userId: record.userId } }),
  ]);

  const store = await cookies();
  store.delete(RESET_COOKIE);
  redirect("/login?reset=1");
}

const sellerSchema = z.object({
  storeName: z.string().trim().min(2, "Nama toko minimal 2 karakter").max(80),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter").max(2000),
  verification: z.string().trim().min(5, "Data verifikasi wajib diisi").max(1000),
});

export async function becomeSellerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/seller/daftar");
  if (user.seller) redirect("/seller");

  const parsed = sellerSchema.safeParse({
    storeName: formData.get("storeName"),
    description: formData.get("description"),
    verification: formData.get("verification"),
  });
  if (!parsed.success) {
    return { error: "Periksa kembali data yang kamu isi.", fieldErrors: fieldErrors(parsed.error) };
  }

  const existingSlug = await prisma.seller.findUnique({
    where: { slug: uniqueSlug(parsed.data.storeName) },
    select: { id: true },
  });
  if (existingSlug) {
    return { error: "Slug toko bentrok. Silakan coba lagi." };
  }

  await prisma.$transaction([
    prisma.seller.create({
      data: {
        userId: user.id,
        name: parsed.data.storeName,
        slug: uniqueSlug(parsed.data.storeName),
        description: parsed.data.description,
        verification: parsed.data.verification,
        status: "PENDING",
      },
    }),
    prisma.user.update({ where: { id: user.id }, data: { role: "SELLER" } }),
  ]);

  redirect("/seller?submitted=1");
}
