import { Hero } from "@/components/homepage/hero";
import { CategoryGrid } from "@/components/homepage/category-grid";
import { FreshDrops } from "@/components/homepage/fresh-drops";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { ProductGrid } from "@/components/homepage/product-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FreshDrops />
      <TrustStrip />
      <ProductGrid />
    </>
  );
}
