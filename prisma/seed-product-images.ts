import "dotenv/config";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL belum disetel");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

const imageDir = path.join(process.cwd(), "public", "images", "products");

async function main() {
  await mkdir(imageDir, { recursive: true });
  const raw = await readFile(path.join(process.cwd(), "scripts", "products-source.json"), "utf8");
  const sources = JSON.parse(raw) as { image: string }[];

  let updated = 0;
  for (let index = 0; index < sources.length; index += 1) {
    const prefix = `sh-${index + 1}-`;
    const product = await prisma.product.findFirst({ where: { slug: { startsWith: prefix } } });
    if (!product) continue;

    let localUrl: string | null = null;
    try {
      const response = await fetch(sources[index].image);
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.byteLength <= 2_000_000) {
          const filename = `sh-${index + 1}.webp`;
          await writeFile(path.join(imageDir, filename), buffer);
          localUrl = `/images/products/${filename}`;
        }
      }
    } catch {
      localUrl = null;
    }

    if (!localUrl) continue;
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, url: localUrl, alt: product.name, position: 0 },
    });
    updated += 1;
  }

  console.log(`Gambar produk diperbarui: ${updated}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
