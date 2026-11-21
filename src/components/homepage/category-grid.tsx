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
            className="category-card group relative aspect-square overflow-hidden bg-black-sh"
            data-cursor
          >
            <span className="pointer-events-none absolute inset-0" aria-hidden>
              <CardModel3DLazy
                url={category.modelUrl}
                fallbackImage={category.image}
                name={category.name}
                color="#2e2e2e"
              />
            </span>
            <span className="category-overlay absolute inset-0 bg-gradient-to-t from-black-sh via-black-sh/20 to-transparent transition-opacity duration-200 group-hover:opacity-90" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="category-title font-display text-xl uppercase text-offwhite transition-transform duration-200 md:text-2xl">
                {category.name}
              </h3>
              <span className="category-rule mt-1 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-200" aria-hidden />
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-widest text-muted">{category.count} produk</p>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Shop Now →</span>
              </div>
            </div>
          </Link>
        ))}
      </StaggerGroup>
    </section>
  );
}
