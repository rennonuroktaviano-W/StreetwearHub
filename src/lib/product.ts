export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  publishedAt: Date | null;
  soldCount: number;
  images: { url: string; alt: string | null }[];
  variants: { price: number; stock: number }[];
  seller: { name: string; slug: string };
  brand?: { name: string } | null;
};

export type ProductBadge = "NEW" | "LIMITED" | "SOLD OUT";

export function getBadges(product: {
  publishedAt: Date | null;
  variants: { stock: number }[];
}): ProductBadge[] {
  const badges: ProductBadge[] = [];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  if (totalStock <= 0) return ["SOLD OUT"];
  if (product.publishedAt && Date.now() - product.publishedAt.getTime() < 14 * 24 * 60 * 60 * 1000) {
    badges.push("NEW");
  }
  if (totalStock < 5) badges.push("LIMITED");
  return badges;
}

export function minPrice(variants: { price: number }[]): number {
  return variants.length ? Math.min(...variants.map((v) => v.price)) : 0;
}
