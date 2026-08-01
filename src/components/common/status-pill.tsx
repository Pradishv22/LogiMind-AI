import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  "In Transit": "text-primary border-primary/35 bg-primary/12",
  "On Route": "text-primary border-primary/35 bg-primary/12",
  Delivered: "text-success border-success/35 bg-success/12",
  Delayed: "text-warning border-warning/35 bg-warning/12",
  "At Hub": "text-accent border-accent/35 bg-accent/12",
  Loading: "text-accent border-accent/35 bg-accent/12",
  Rerouted: "text-chart-5 border-chart-5/35 bg-chart-5/12",
  Idle: "text-muted-foreground border-border bg-muted/40",
  Maintenance: "text-warning border-warning/35 bg-warning/12",
  Breakdown: "text-destructive border-destructive/40 bg-destructive/12",
  Critical: "text-destructive border-destructive/40 bg-destructive/12",
  High: "text-warning border-warning/35 bg-warning/12",
  Medium: "text-accent border-accent/35 bg-accent/12",
  Low: "text-muted-foreground border-border bg-muted/40",
};

export function StatusPill({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        map[value] ?? "text-muted-foreground border-border bg-muted/40",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function MeterBar({
  value,
  tone = "auto",
}: {
  value: number;
  tone?: "auto" | "primary" | "cyan" | "emerald";
}) {
  const color =
    tone !== "auto"
      ? { primary: "bg-primary", cyan: "bg-accent", emerald: "bg-success" }[tone]
      : value >= 70
        ? "bg-success"
        : value >= 40
          ? "bg-warning"
          : "bg-destructive";
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="h-1.5 w-full min-w-[52px] overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}
