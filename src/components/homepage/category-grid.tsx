import Link from "next/link";
import { CATEGORIES } from "@/data/home";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { CardModel3DLazy } from "@/components/three/card-model-3d-lazy";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8" aria-labelledby="category-title">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Jelajahi</p>
          <h2 id="category-title" className="font-display text-3xl uppercase text-offwhite md:text-4xl">
            Kategori
          </h2>
        </div>
        <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors duration-200 hover:text-offwhite">
          Semua Kategori
        </Link>
      </div>

      <StaggerGroup className="grid grid-cols-2 gap-px border border-mid bg-mid md:grid-cols-4" stagger={0.1}>
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={`/shop?kategori=${encodeURIComponent(category.name)}`}
            className="category-card group relative flex aspect-square flex-col overflow-hidden bg-black-sh"
            data-cursor
          >
            <div className="relative min-h-0 flex-1" aria-hidden>
              <CardModel3DLazy
                url={category.modelUrl}
                fallbackImage={category.image}
                name={category.name}
                color="#3a3a3a"
              />
            </div>

            <div className="relative z-10 shrink-0 border-t border-mid bg-black-sh/95 px-4 py-3">
              <h3 className="category-title font-display text-lg uppercase leading-none text-offwhite transition-transform duration-200 md:text-xl">
                {category.name}
              </h3>
              <span className="category-rule mt-2 block h-px w-8 origin-left scale-x-0 bg-accent transition-transform duration-200" aria-hidden />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                  {category.count} produk
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-accent">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </StaggerGroup>
    </section>
  );
}
