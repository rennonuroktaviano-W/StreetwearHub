"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: { transaction_status?: string }) => void;
          onPending: () => void;
          onError: () => void;
          onClose: () => void;
        },
      ) => void;
    };
  }
}

export function SnapPayment({ token, orderId }: { token: string; orderId: string }) {
  const router = useRouter();
  const { clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-midtrans-snap]");
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "");
    script.setAttribute("data-midtrans-snap", "true");
    script.async = true;
    script.onerror = () => setError("Gagal memuat Midtrans Snap. Periksa koneksi internet.");
    document.head.appendChild(script);
  }, []);

  function pay() {
    const snap = window.snap;
    if (!snap) {
      setError("Midtrans Snap belum siap. Coba muat ulang halaman.");
      return;
    }
    setLoading(true);
    snap.pay(token, {
      onSuccess: () => {
        clear();
        router.push(`/akun/pesanan/${orderId}?paid=1`);
      },
      onPending: () => {
        clear();
        router.push(`/akun/pesanan/${orderId}`);
      },
      onError: () => {
        setLoading(false);
        setError("Pembayaran gagal. Silakan coba lagi.");
      },
      onClose: () => setLoading(false),
    });
  }

  return (
    <div>
      {error ? <p role="alert" className="mb-3 border border-accent p-3 text-sm text-accent">{error}</p> : null}
      <button type="button" onClick={pay} disabled={loading} className="btn-accent w-full">
        {loading ? "Membuka Pembayaran..." : "Bayar Sekarang"}
      </button>
    </div>
  );
}
