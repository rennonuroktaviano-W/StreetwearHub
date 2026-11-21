"use client";

import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function MarqueeText({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const { reduced } = useMotionPrefs();

  if (reduced) {
    return (
      <div className={`flex flex-wrap justify-center gap-x-6 gap-y-1 py-1 ${className}`}>
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`} aria-label={items.join(" · ")}>
      <div className="sh-marquee flex w-max gap-8 whitespace-nowrap">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8">
            <span>{item}</span>
            <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
