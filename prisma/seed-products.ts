import "dotenv/config";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL belum disetel");

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

type Source = {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  brand: string;
  stock: number;
};

const SELLERS = [
  { name: "Ruang Gelap Co.", slug: "ruang-gelap-co" },
  { name: "Sudut Utara", slug: "sudut-utara" },
  { name: "Garis Hitam", slug: "garis-hitam" },
  { name: "Kepingan Kota", slug: "kepingan-kota" },
];

const CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  "mens-shirts": { name: "T-Shirts", slug: "t-shirts" },
  tops: { name: "T-Shirts", slug: "t-shirts" },
  "mens-shoes": { name: "Footwear", slug: "footwear" },
  sunglasses: { name: "Accessories", slug: "accessories" },
  "womens-bags": { name: "Accessories", slug: "accessories" },
};

const CLEAN_TITLES: Record<string, string> = {
  "Blue & Black Check Shirt": "Checkered Street Shirt",
  "Gigabyte Aorus Men Tshirt": "Everyday Graphic Tee",
  "Man Plaid Shirt": "Plaid Overshirt",
};

function cleanTitle(title: string, index: number): string {
  if (CLEAN_TITLES[title]) return CLEAN_TITLES[title];
  const stripped = title
    .replace(/\b(gigabyte|aorus|nike|adidas|puma|levi's|fossil|polo|ralph lauren|chanel|gucci|louis vuitton|apple|samsung|sony|bosch|beats|dragon|balenciaga|supreme)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const base = stripped.length > 3 ? stripped : "Streetwear Essentials";
  return `${base.charAt(0).toUpperCase()}${base.slice(1)}`.slice(0, 80) || `Streetwear Piece ${index + 1}`;
}

const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["Hitam", "Abu", "Off-White"];
const imageDir = path.join(process.cwd(), "public", "images", "products");

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > 2_000_000) return null;
    await writeFile(path.join(imageDir, filename), buffer);
    return `/images/products/${filename}`;
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(imageDir, { recursive: true });

  const raw = await readFile(path.join(process.cwd(), "scripts", "products-source.json"), "utf8");
  const sources = JSON.parse(raw) as Source[];

  const categoryRecords: Record<string, { id: string; slug: string }> = {};
  for (const key of Object.keys(CATEGORY_MAP)) {
    const def = CATEGORY_MAP[key];
    const record = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {},
      create: { name: def.name, slug: def.slug, description: `${def.name} dari seller independen StreetwearHub` },
    });
    categoryRecords[key] = { id: record.id, slug: record.slug };
  }

  const brand = await prisma.brand.upsert({
    where: { slug: "streetwearhub-select" },
    update: {},
    create: { name: "StreetwearHub Select", slug: "streetwearhub-select" },
  });

  const sellerRecords = [];
  for (const seller of SELLERS) {
    const email = `${seller.slug}@streetwearhub.id`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "SELLER" },
      create: { name: seller.name, email, passwordHash: "seed-no-login", role: "SELLER" },
    });
    const record = await prisma.seller.upsert({
      where: { userId: user.id },
      update: { status: "APPROVED" },
      create: {
        userId: user.id,
        name: seller.name,
        slug: seller.slug,
        description: `Toko independen di StreetwearHub — ${seller.name}`,
        verification: "seed",
        status: "APPROVED",
      },
    });
    sellerRecords.push(record);
  }

  let created = 0;
  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    const categoryKey = source.category in CATEGORY_MAP ? source.category : "mens-shirts";
    const category = categoryRecords[categoryKey];
    const seller = sellerRecords[index % sellerRecords.length];
    const name = cleanTitle(source.title, index);
    const slug = `sh-${index + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;

    const localImage = await downloadImage(source.image, `sh-${index + 1}.png`);
    const basePrice = Math.round((source.price * 16000) / 1000) * 1000;
    const stock = Math.max(3, Math.min(source.stock || 12, 20));

    const variants = SIZES.map((size, variantIndex) => ({
      size,
      color: COLORS[variantIndex % COLORS.length],
      sku: `SH-${String(index + 1).padStart(3, "0")}-${size}-${variantIndex}`,
      price: basePrice + variantIndex * 5000,
      stock: Math.max(0, stock - variantIndex * 2),
      position: variantIndex,
    }));

    await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: category.id,
        brandId: brand.id,
        name,
        slug,
        description: `Produk streetwear pilihan dari ${seller.name}. ${source.description.slice(0, 220)}`.slice(0, 600),
        status: "ACTIVE",
        publishedAt: new Date(Date.now() - index * 86400000),
        soldCount: (index * 7) % 90,
        variants: { create: variants },
        images: localImage
          ? { create: [{ url: localImage, alt: name, position: 0 }] }
          : undefined,
      },
    });
    created += 1;
  }

  console.log(`Seed produk selesai. Produk baru: ${created}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
