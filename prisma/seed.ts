import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL belum disetel");

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@streetwearhub.id";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", name: "Admin StreetwearHub" },
    create: {
      name: "Admin StreetwearHub",
      email: adminEmail,
      passwordHash: hashSync(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const categories = ["Hoodie", "Kaos", "Sneakers", "Jaket", "Celana", "Aksesoris"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase() },
      update: {},
      create: { name, slug: name.toLowerCase() },
    });
  }

  const brands = ["UrbanForm", "Northlane", "Garis Studio", "Ruang Kreatif"];
  for (const name of brands) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  console.log(`Seed selesai. Admin: ${admin.email}`);
  console.log(`Password default: ${adminPassword} (ganti lewat SEED_ADMIN_PASSWORD)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
