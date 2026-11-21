export type DummyProduct = {
  id: string;
  name: string;
  seller: string;
  price: number;
  image: string;
  badge?: "NEW" | "LIMITED" | "SOLD OUT";
};

export const CATEGORIES = [
  { name: "T-Shirts", image: "/images/placeholder-tshirt.svg", count: 128 },
  { name: "Outerwear", image: "/images/placeholder-jacket.svg", count: 74 },
  { name: "Footwear", image: "/images/placeholder-sneaker.svg", count: 56 },
  { name: "Accessories", image: "/images/placeholder-cap.svg", count: 92 },
] as const;

export const FEATURED_PRODUCTS: DummyProduct[] = [
  { id: "p1", name: "Heavyweight Boxy Tee", seller: "Ruang Gelap Co.", price: 189000, image: "/images/product-1.svg", badge: "NEW" },
  { id: "p2", name: "Utility Worker Jacket", seller: "Sudut Utara", price: 425000, image: "/images/product-2.svg", badge: "LIMITED" },
  { id: "p3", name: "Trail Runner 01", seller: "Langkah Studio", price: 689000, image: "/images/product-3.svg" },
  { id: "p4", name: "Washed Cargo Pant", seller: "Garis Hitam", price: 315000, image: "/images/product-4.svg" },
  { id: "p5", name: "Canvas Logo Cap", seller: "Kepingan Kota", price: 129000, image: "/images/product-5.svg", badge: "SOLD OUT" },
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
