"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const alreadyShown = window.sessionStorage.getItem("sh_splash_shown") === "1";
    if (alreadyShown) return;

    window.sessionStorage.setItem("sh_splash_shown", "1");

    const showTimer = window.setTimeout(() => setVisible(true), 0);
    const leaveTimer = window.setTimeout(() => setLeaving(true), 750);
    const hideTimer = window.setTimeout(() => setVisible(false), 1150);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black-sh ${leaving ? "splash-leave" : ""}`}
      role="status"
      aria-label="Memuat StreetwearHub"
    >
      <p className="font-display text-4xl uppercase tracking-wide text-offwhite sm:text-6xl">
        Street<span className="text-accent">Hub</span>
      </p>
      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.35em] text-muted">
        Built for the real ones
      </p>
      <div className="mt-8 h-px w-48 overflow-hidden bg-mid">
        <span className="splash-progress block h-full w-full origin-left bg-accent" />
      </div>
    </div>
  );
}
