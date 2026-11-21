export type AddressSnapshot = {
  label?: string;
  recipient?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  detail?: string;
};

export function parseAddressSnapshot(value: unknown): AddressSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as AddressSnapshot;
}

export function formatAddress(snap: AddressSnapshot): string {
  return [snap.detail, snap.district, snap.city, snap.province, snap.postalCode]
    .filter(Boolean)
    .join(", ");
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  DIBAYAR: "Dibayar",
  DIKEMAS: "Dikemas",
  DIKIRIM: "Dikirim",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};
