import { Fuel, HeartPulse } from "lucide-react";
import { MeterBar, StatusPill } from "@/components/common/status-pill";
import type { Truck } from "@/lib/api";

export function FleetStatusPanel({ data, limit }: { data: Truck[]; limit?: number }) {
  const rows = limit ? data.slice(0, limit) : data;
  return (
    <div className="space-y-2.5">
      {rows.map((t, i) => (
        <div
          key={t.id}
          className="animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card/50 p-3 transition-colors hover:border-primary/40 hover:bg-card"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
              <span className="truncate text-xs text-muted-foreground">{t.driver}</span>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex min-w-0 items-center gap-2">
                <Fuel className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <MeterBar value={t.fuel} />
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <HeartPulse className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <MeterBar value={t.health} />
              </div>
            </div>
          </div>
          <StatusPill value={t.status} />
        </div>
      ))}
    </div>
  );
}
