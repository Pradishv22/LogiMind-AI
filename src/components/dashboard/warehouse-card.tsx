import { Warehouse as WarehouseIcon } from "lucide-react";
import type { Warehouse } from "@/lib/api";
import { cn } from "@/lib/utils";

export function WarehouseCard({ w, index = 0 }: { w: Warehouse; index?: number }) {
  const pct = w.capacity > 0 ? Math.round((w.used / w.capacity) * 100) : 0;
  const tone = pct >= 90 ? "destructive" : pct >= 70 ? "warning" : "success";
  const bar = { destructive: "bg-destructive", warning: "bg-warning", success: "bg-success" }[tone];
  const text = {
    destructive: "text-destructive",
    warning: "text-warning",
    success: "text-success",
  }[tone];
  return (
    <div
      className="glass glass-hover animate-rise rounded-2xl p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight">{w.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {w.city} · {w.id}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/12 text-accent">
          <WarehouseIcon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className={cn("text-2xl font-extrabold tabular-nums", text)}>{pct}%</p>
        <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {w.used.toLocaleString("en-IN")} / {w.capacity.toLocaleString("en-IN")} m³
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", bar)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-lg border border-border bg-card/50 px-2.5 py-1.5 text-muted-foreground">
          Available: {w.available.toLocaleString("en-IN")}
        </span>
        <span className="rounded-lg border border-border bg-card/50 px-2.5 py-1.5 text-muted-foreground">
          Risk: {w.risk ?? "Unknown"}
        </span>
      </div>
    </div>
  );
}
