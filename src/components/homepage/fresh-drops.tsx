"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

const FreshDropsModel = dynamic(() => import("@/components/three/fresh-drops-model"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-charcoal" />,
});

export function FreshDrops() {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const signature = useRef<SVGPathElement>(null);
  const { reduced, mobile, ready } = useMotionPrefs();

  useEffect(() => {
    if (!ready || !root.current) return;
    const context = gsap.context(() => {
      if (!reduced) {
        gsap.from("[data-mask-line]", {
          yPercent: 110,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
      }

      if (!reduced && !mobile && image.current) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          image.current,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (!reduced && signature.current) {
        const path = signature.current;
        const length = path.getTotalLength();
        if (!length) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: path, start: "top 90%", once: true },
        });
      }
    }, root);

    return () => context.revert();
  }, [ready, reduced, mobile]);

  return (
    <section ref={root} className="border-y border-mid bg-light" aria-labelledby="fresh-title">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[1fr_1.1fr_1fr] md:gap-10 md:px-8 md:py-16">
        <div className="text-black-sh">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Baru Tiba</p>
          <h2 id="fresh-title" className="mt-3 font-display text-4xl uppercase md:text-5xl">
            <span className="mask-line"><span data-mask-line className="block">Fresh</span></span>
            <span className="mask-line"><span data-mask-line className="block">Drops</span></span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mid">
            Rilisan terbaru dari seller independen. Stok terbatas, jadi jangan tunggu terlalu lama.
          </p>
          <Link href="/shop?sort=newest" className="btn-outline mt-6 border-black-sh !text-black-sh hover:!bg-black-sh hover:!text-offwhite">
            View All
          </Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden border border-mid bg-charcoal md:aspect-[3/4]">
          <div ref={image} className="absolute inset-0">
            <FreshDropsModel />
          </div>
        </div>
        <div className="text-black-sh md:pl-2">
          <p className="font-display text-2xl uppercase leading-tight md:text-3xl">
            Wear it.<br />Own it.
          </p>
          <div className="mt-5 h-px w-12 bg-accent" />
          <p className="mt-5 text-sm leading-relaxed text-mid">
            Setiap potongan punya cerita. Didesain untuk dipakai setiap hari, bukan cuma dipajang.
          </p>
          <svg viewBox="0 0 240 60" className="mt-6 h-12 w-48" aria-label="Tanda tangan StreetwearHub">
            <path
              ref={signature}
              d="M4 42 C 24 8, 34 8, 40 40 C 46 12, 58 10, 62 40 C 70 16, 86 16, 92 42 C 100 20, 114 18, 122 40 C 134 10, 150 14, 158 40 C 170 14, 190 16, 200 38 C 208 24, 220 26, 236 34"
              fill="none"
              stroke="#b3202a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-mid">StreetwearHub</p>
        </div>
      </div>
    </section>
  );
}
