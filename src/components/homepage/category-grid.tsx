import Link from "next/link";
import { CATEGORIES } from "@/data/home";
import { StaggerGroup } from "@/components/motion/stagger-group";

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
            className="category-card group relative flex min-h-52 flex-col justify-between bg-black-sh p-5"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                {String(CATEGORIES.indexOf(category) + 1).padStart(2, "0")}
              </span>
              <h3 className="category-title mt-3 font-display text-2xl uppercase leading-none text-offwhite transition-transform duration-200 md:text-3xl">
                {category.name}
              </h3>
              <span className="category-rule mt-3 block h-px w-8 origin-left scale-x-0 bg-accent transition-transform duration-200" aria-hidden />
              <p className="mt-3 text-xs leading-relaxed text-muted">{category.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-2 border-t border-mid pt-3">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                {category.count} produk
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-accent">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </StaggerGroup>
    </section>
  );
}
