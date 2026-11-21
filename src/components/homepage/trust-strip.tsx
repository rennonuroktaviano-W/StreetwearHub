"use client";

import { motion } from "motion/react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

const TRUST = [
  {
    title: "Pengiriman Cepat",
    desc: "Dari seller langsung ke pintumu",
    icon: (
      <>
        <path d="M2 7h12v10H2z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="6.5" cy="19" r="1.8" />
        <circle cx="17.5" cy="19" r="1.8" />
      </>
    ),
  },
  {
    title: "Pembayaran Aman",
    desc: "VA, e-wallet, dan QRIS",
    icon: (
      <>
        <path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Pengembalian Mudah",
    desc: "Proses dibantu tim kami",
    icon: (
      <>
        <path d="M20 8a8 8 0 1 0 1 6" />
        <path d="M20 4v4h-4" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    title: "Kualitas Terjamin",
    desc: "Seller terverifikasi",
    icon: (
      <>
        <path d="m12 2 2.4 5 5.6.8-4 4 1 5.7-5-2.7-5 2.7 1-5.7-4-4 5.6-.8L12 2Z" />
      </>
    ),
  },
];

export function TrustStrip() {
  const { reduced, ready } = useMotionPrefs();

  return (
    <section className="border-b border-mid bg-light" aria-label="Keunggulan layanan">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-px bg-mid md:grid-cols-4">
          {TRUST.map((item, index) => (
            <motion.div
              key={item.title}
              className="trust-card group relative flex flex-col items-start bg-light px-5 py-7 text-black-sh"
              initial={!ready || reduced ? false : { opacity: 0, y: 18 }}
              whileInView={!ready || reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute right-4 top-4 font-display text-5xl leading-none text-black/[0.05] transition-colors duration-200 group-hover:text-accent/20">
                0{index + 1}
              </span>

              <div className="trust-icon flex h-12 w-12 items-center justify-center border border-mid bg-black-sh text-accent transition-transform duration-200 group-hover:-translate-y-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {item.icon}
                </svg>
              </div>

              <span className="trust-rule mt-5 block h-px w-6 origin-left scale-x-100 bg-accent transition-transform duration-200 group-hover:scale-x-[3]" aria-hidden />

              <h3 className="mt-4 font-display text-lg uppercase leading-none md:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-mid">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
