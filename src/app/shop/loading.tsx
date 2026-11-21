export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8" aria-busy="true" aria-label="Memuat katalog">
      <div className="shimmer h-3 w-32" />
      <div className="shimmer mt-4 h-12 w-64" />
      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="hidden space-y-4 md:block">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer h-8 w-full" />)}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="shimmer aspect-[3/4] w-full" />
              <div className="shimmer mt-3 h-3 w-2/3" />
              <div className="shimmer mt-2 h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
