const TRUST = [
  {
    title: "Pengiriman Cepat",
    desc: "Dari seller langsung ke pintumu",
    icon: (
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    ),
  },
  {
    title: "Pembayaran Aman",
    desc: "VA, e-wallet, dan QRIS",
    icon: <path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4Zm-1 11-3-3 1.4-1.4L11 10.2l4.6-4.6L17 7l-6 6Z" />,
  },
  {
    title: "Pengembalian Mudah",
    desc: "Proses dibantu tim kami",
    icon: <path d="M4 7h13v10H4zM9 3 5 7l4 4M15 17l4 4-4 4" />,
  },
  {
    title: "Kualitas Terjamin",
    desc: "Seller terverifikasi",
    icon: <path d="m12 2 2.4 5 5.6.8-4 4 .9 5.7-4.9-2.7-4.9 2.7.9-5.7-4-4 5.6-.8L12 2Z" />,
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-mid bg-light" aria-label="Keunggulan layanan">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-mid md:grid-cols-4 md:px-8">
        {TRUST.map((item) => (
          <div key={item.title} className="flex flex-col items-center bg-light px-4 py-8 text-center text-black-sh">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent" aria-hidden>
              {item.icon}
            </svg>
            <h3 className="mt-3 text-xs font-bold uppercase tracking-[0.12em]">{item.title}</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-mid">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
