import { cn } from "@/lib/utils";

export function BlockSkeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-2xl", className)} />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((__, j) => (
            <div key={j} className="skeleton-shimmer h-4 rounded-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {[55, 78, 40, 92, 63, 85, 48, 70].map((h, i) => (
        <div key={i} className="skeleton-shimmer w-full rounded-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
