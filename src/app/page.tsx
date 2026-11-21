import { HeroMotion } from "@/components/homepage/hero-motion";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { FreshDrops } from "@/components/homepage/fresh-drops";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { ProductGrid } from "@/components/homepage/product-grid";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getSessionUser } from "@/lib/auth";

export const instant = false;

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <SmoothScroll />
      <HeroMotion />
      <CategoryGrid />
      <FreshDrops />
      <TrustStrip />
      <ProductGrid isLoggedIn={Boolean(user)} />
    </>
  );
}
