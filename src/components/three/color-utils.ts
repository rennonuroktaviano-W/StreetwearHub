const COLOR_MAP: Record<string, string> = {
  hitam: "#141414",
  black: "#141414",
  putih: "#e9e9e6",
  white: "#e9e9e6",
  abu: "#6f6f6f",
  grey: "#6f6f6f",
  gray: "#6f6f6f",
  merah: "#b3202a",
  red: "#b3202a",
  navy: "#1c2a44",
  biru: "#1c2a44",
  blue: "#1c2a44",
  hijau: "#2f4a36",
  green: "#2f4a36",
  krem: "#cfc6b4",
  cream: "#cfc6b4",
  coklat: "#5a3f2e",
  brown: "#5a3f2e",
};

export function colorToHex(value: string | null | undefined): string {
  if (!value) return "#2e2e2e";
  const key = value.trim().toLowerCase();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(key)) return key;
  return "#2e2e2e";
}
