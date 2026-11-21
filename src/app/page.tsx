import { HeroMotion } from "@/components/homepage/hero-motion";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { FreshDrops } from "@/components/homepage/fresh-drops";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { ProductGrid, getFeaturedProducts } from "@/components/homepage/product-grid";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export const instant = false;

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      <SmoothScroll />
      <HeroMotion />
      <CategoryGrid />
      <FreshDrops />
      <TrustStrip />
      <ProductGrid products={products} />
    </>
  );
}
