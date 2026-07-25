export function BoardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-40 rounded-md bg-muted" />
        <div className="mt-2 h-4 w-56 rounded-md bg-muted" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2, 3].map((col) => (
            <div
              key={col}
              className="h-[min(560px,calc(100vh-360px))] w-[280px] shrink-0 overflow-hidden rounded-xl border border-border"
            >
              <div className="h-11 bg-muted" />
              <div className="space-y-2 bg-muted/40 p-2">
                {[0, 1, 2].map((card) => (
                  <div
                    key={card}
                    className="h-20 rounded-lg bg-card border border-border p-3"
                  >
                    <div className="mb-2 h-3 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}