import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/prisma-client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL belum disetel");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const imageDir = path.join(process.cwd(), "public", "images", "products");

const ITEMS = [
  { name: "Crystal Stud Earrings", url: "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/1.webp", price: 89000 },
  { name: "Oval Drop Earrings", url: "https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/1.webp", price: 105000 },
  { name: "Tropical Statement Earrings", url: "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/1.webp", price: 119000 },
  { name: "Leather Strap Watch", url: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/1.webp", price: 259000 },
  { name: "Gold Tone Watch", url: "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/1.webp", price: 239000 },
  { name: "Everyday Wrist Watch", url: "https://cdn.dummyjson.com/product-images/womens-watches/women's-wrist-watch/1.webp", price: 199000 },
];

async function main() {
  await mkdir(imageDir, { recursive: true });
  const category = await prisma.category.findUnique({ where: { slug: "accessories" } });
  const seller = await prisma.seller.findFirst({ where: { status: "APPROVED" } });
  if (!category || !seller) throw new Error("Kategori atau seller belum ada");

  let created = 0;
  for (let index = 0; index < ITEMS.length; index += 1) {
    const item = ITEMS[index];
    const slug = `sh-acc-${index + 1}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    if (await prisma.product.findUnique({ where: { slug } })) continue;

    let localUrl: string | null = null;
    try {
      const response = await fetch(item.url);
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = `sh-acc-${index + 1}.webp`;
        await writeFile(path.join(imageDir, filename), buffer);
        localUrl = `/images/products/${filename}`;
      }
    } catch {
      localUrl = null;
    }

    await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: category.id,
        name: item.name,
        slug,
        description: `${item.name} — aksesoris penambah outfit dari seller independen StreetwearHub.`,
        status: "ACTIVE",
        publishedAt: new Date(Date.now() - index * 3600000),
        soldCount: (index * 11) % 60,
        variants: {
          create: [
            { size: "One Size", color: "Hitam", sku: `SH-ACC-${index + 1}-ONE`, price: item.price, stock: 12, position: 0 },
            { size: "One Size", color: "Emas", sku: `SH-ACC-${index + 1}-GOLD`, price: item.price + 10000, stock: 8, position: 1 },
          ],
        },
        images: localUrl ? { create: [{ url: localUrl, alt: item.name, position: 0 }] } : undefined,
      },
    });
    created += 1;
  }

  console.log(`Aksesoris baru: ${created}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
