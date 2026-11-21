export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8" aria-busy="true" aria-label="Memuat halaman">
      <div className="flex items-center gap-3">
        <span className="font-display text-2xl uppercase text-offwhite">
          Street<span className="text-accent">Hub</span>
        </span>
        <span className="h-3 w-3 animate-spin border-2 border-mid border-t-accent" aria-hidden />
      </div>
      <div className="mt-8 shimmer h-3 w-40" />
      <div className="shimmer mt-6 h-20 w-2/3" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="shimmer aspect-[3/4] w-full" />
            <div className="shimmer mt-3 h-3 w-1/2" />
            <div className="shimmer mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
