import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tone?: "primary" | "cyan" | "emerald" | "warning";
  index?: number;
}

const toneRing: Record<string, string> = {
  primary: "text-primary bg-primary/12 border-primary/25",
  cyan: "text-accent bg-accent/12 border-accent/25",
  emerald: "text-success bg-success/12 border-success/25",
  warning: "text-warning bg-warning/12 border-warning/25",
};

export function KpiCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  tone = "primary",
  index = 0,
}: KpiProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div
      className="glass glass-hover animate-rise relative overflow-hidden rounded-2xl p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[image:var(--gradient-primary)] opacity-[0.13] blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
            toneRing[tone],
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-[26px] font-extrabold tracking-tight tabular-nums">{value}</p>
      <p
        className={cn(
          "mt-1.5 inline-flex items-center gap-1 text-xs font-semibold",
          trend === "up" ? "text-success" : "text-destructive",
        )}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {delta}
        <span className="font-normal text-muted-foreground">vs last week</span>
      </p>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="skeleton-shimmer h-3 w-24 rounded-full" />
        <div className="skeleton-shimmer h-9 w-9 rounded-xl" />
      </div>
      <div className="skeleton-shimmer mt-4 h-7 w-28 rounded-lg" />
      <div className="skeleton-shimmer mt-3 h-3 w-32 rounded-full" />
    </div>
  );
}
