import { HeroMotion } from "@/components/homepage/hero-motion";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { FreshDrops } from "@/components/homepage/fresh-drops";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { ProductGrid, getFeaturedProducts } from "@/components/homepage/product-grid";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function HomePage() {
  const [products, latest] = await Promise.all([
    getFeaturedProducts(),
    prisma.product.findFirst({
      where: { status: "ACTIVE", seller: { status: "APPROVED" } },
      orderBy: { publishedAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
  ]);

  const heroImage = products[0]?.images[0]?.url ?? null;
  const heroName = products[0]?.name ?? "Streetwear pilihan StreetwearHub";
  const dropImage = latest?.images[0]?.url ?? null;
  const dropName = latest?.name ?? "Fresh Drop StreetwearHub";

  return (
    <>
      <SmoothScroll />
      <HeroMotion image={heroImage} name={heroName} />
      <CategoryGrid />
      <FreshDrops image={dropImage} name={dropName} />
      <TrustStrip />
      <ProductGrid products={products} />
    </>
  );
}
