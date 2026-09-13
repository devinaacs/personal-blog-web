export function GridLines({
  columns = 12,
  className = "",
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div
          className={index === 0 ? "" : "border-l border-line/70"}
          key={index}
        />
      ))}
    </div>
  );
}

export function RegisterMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`text-ink/40 ${className}`}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
    >
      <path d="M8 0V16M0 8H16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
