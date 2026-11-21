export const SITE_NAME = "StreetwearHub";
export const SITE_DESCRIPTION =
  "Marketplace streetwear multi-seller. Temukan drop terbaru dari brand independen favoritmu dalam satu tempat.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CURRENCY = "IDR";

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}

export const TRUST_ITEMS = [
  { title: "Pengiriman Cepat", desc: "Dikirim langsung oleh seller" },
  { title: "Pembayaran Aman", desc: "VA, e-wallet, dan QRIS" },
  { title: "Pengembalian Mudah", desc: "Dibantu tim StreetwearHub" },
  { title: "Kualitas Premium", desc: "Kurasi brand independen" },
] as const;
