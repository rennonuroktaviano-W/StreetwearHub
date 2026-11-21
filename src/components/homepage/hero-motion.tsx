"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function HeroMotion() {
  const root = useRef<HTMLDivElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);
  const watermark = useRef<HTMLSpanElement>(null);
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
          { yPercent: 10 },
          {
            yPercent: -10,
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
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-20">
        <div className="relative z-10">
          <p data-hero-line className="mb-5 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Marketplace Streetwear #1
          </p>
          <h1 id="hero-title" className="font-display text-5xl leading-[0.92] uppercase text-offwhite sm:text-6xl lg:text-7xl">
            <span data-hero-line className="block">Built for the</span>
            <span data-hero-line className="block text-accent">Real Ones.</span>
          </h1>
          <p data-hero-fade className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Temukan kaos, jaket, dan sneakers dari toko independen pilihan. Satu katalog,
            satu keranjang, banyak cerita.
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
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
          <dl data-hero-fade className="mt-10 flex gap-8 border-t border-mid pt-6">
            <div><dt className="text-[10px] uppercase tracking-widest text-muted">Toko</dt><dd className="mt-1 font-display text-2xl text-offwhite">120+</dd></div>
            <div><dt className="text-[10px] uppercase tracking-widest text-muted">Produk</dt><dd className="mt-1 font-display text-2xl text-offwhite">2.400+</dd></div>
            <div><dt className="text-[10px] uppercase tracking-widest text-muted">Kota</dt><dd className="mt-1 font-display text-2xl text-offwhite">38</dd></div>
          </dl>
        </div>

        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-4 top-1/2 z-0 -translate-y-1/2 whitespace-nowrap font-display text-[18vw] uppercase leading-none text-offwhite/[0.04] md:-left-16 md:text-[10vw]"
          >
            <span ref={watermark} className="block">StreetwearHub</span>
          </span>
          <div ref={imageWrap} className="relative z-10 aspect-[4/5] overflow-hidden border border-mid bg-black-sh" data-cursor>
            <Image
              src="/images/placeholder-hero.svg"
              alt="Model streetwear dalam balutan kaos dan jaket StreetwearHub"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
