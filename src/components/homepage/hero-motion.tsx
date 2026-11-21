"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { HeroModelLazy } from "@/components/three/hero-model-lazy";

const WATERMARK_ROWS = [
  "#streethub #streethub #streethub",
  "#streethub #streethub #streethub",
  "#streethub #streethub #streethub",
  "#streethub #streethub #streethub",
  "#streethub #streethub #streethub",
];

export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);
  const watermark = useRef<HTMLDivElement>(null);
  const { reduced, mobile, ready } = useMotionPrefs();

  useEffect(() => {
    if (!ready || !root.current) return;
    const context = gsap.context(() => {
      if (!reduced) {
        gsap.from("[data-hero-line]", {
          y: 32,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.05,
        });
        gsap.from("[data-hero-fade]", {
          opacity: 0,
          duration: 0.5,
          delay: 0.35,
        });
      }

      if (!reduced && !mobile && imageWrap.current && watermark.current) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(
          imageWrap.current,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          watermark.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => context.revert();
  }, [ready, reduced, mobile]);

  return (
    <section ref={root} className="relative overflow-hidden border-b border-mid bg-charcoal" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden>
        <div ref={watermark} className="absolute inset-0 flex -rotate-3 flex-col justify-center gap-3">
          {WATERMARK_ROWS.map((row, index) => (
            <span
              key={index}
              className="block whitespace-nowrap font-display text-[9vw] uppercase leading-[0.9] tracking-[0.02em] text-offwhite/[0.035] md:text-[5vw]"
            >
              {row}
            </span>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-20">
        <div className="relative z-10">
          <p data-hero-line className="mb-4 inline-block border-l-2 border-accent pl-3 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
            Marketplace Streetwear #1
          </p>
          <h1 id="hero-title" className="font-display text-5xl leading-[0.92] uppercase text-offwhite sm:text-6xl lg:text-7xl">
            <span data-hero-line className="block">Built for the</span>
            <span data-hero-line className="block text-accent">Real Ones.</span>
          </h1>
          <p data-hero-fade className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            Temukan kaos, jaket, dan sneakers dari toko independen pilihan. Satu katalog,
            satu keranjang, banyak cerita.
          </p>
          <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
            <MagneticButton href="/shop" className="btn-outline" strength={12}>
              Shop Now <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton
              href="/seller/daftar"
              className="border border-mid px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-offwhite transition-colors duration-200 hover:border-muted"
              strength={10}
            >
              Jadi Seller
            </MagneticButton>
          </div>
          <dl data-hero-fade className="mt-9 grid grid-cols-3 border-t border-mid pt-5">
            <div className="border-r border-mid pr-4">
              <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">Toko</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">120+</dd>
            </div>
            <div className="border-r border-mid px-4">
              <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">Produk</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">2.400+</dd>
            </div>
            <div className="pl-4">
              <dt className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">Kota</dt>
              <dd className="mt-1 font-display text-2xl text-offwhite">38</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div ref={imageWrap} className="relative z-10 aspect-[4/5] overflow-hidden border border-mid bg-black-sh">
            <div className="absolute inset-0">
              <HeroModelLazy />
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 border border-mid/80 bg-black-sh/80 px-2.5 py-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                Model 3D · Seret untuk memutar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
