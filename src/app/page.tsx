import { HeroMotion } from "@/components/homepage/hero-motion";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { FreshDrops } from "@/components/homepage/fresh-drops";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { ProductGrid } from "@/components/homepage/product-grid";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CustomCursor } from "@/components/motion/custom-cursor";

export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <HeroMotion />
      <CategoryGrid />
      <FreshDrops />
      <TrustStrip />
      <ProductGrid />
    </>
  );
}
