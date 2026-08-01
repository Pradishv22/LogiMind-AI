import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Fuel, Gauge, HeartPulse, MapPin, Truck } from "lucide-react";
import { FleetUtilizationChart } from "@/components/charts/charts";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { BlockSkeleton, ChartSkeleton } from "@/components/common/skeletons";
import { MeterBar, StatusPill } from "@/components/common/status-pill";
import { fleetQuery } from "@/lib/api";

export const Route = createFileRoute("/fleet")({ component: FleetPage });

function FleetPage() {
  const { data: trucks = [], isLoading, error } = useQuery(fleetQuery());
  const onRoute = trucks.filter((truck) => truck.status === "On Route").length;
  const attention = trucks.filter(
    (truck) => truck.health < 80 || truck.fuel < 25 || truck.status === "Breakdown",
  ).length;
  const average = (field: "fuel" | "health") =>
    trucks.length
      ? Math.round(trucks.reduce((sum, truck) => sum + truck[field], 0) / trucks.length)
      : 0;
  const kpis = [
    {
      label: "Total Fleet",
      value: trucks.length.toString(),
      delta: "Live inventory",
      trend: "up" as const,
      icon: Truck,
      tone: "primary" as const,
    },
    {
      label: "On Route",
      value: onRoute.toString(),
      delta: "Active assignments",
      trend: "up" as const,
      icon: Gauge,
      tone: "cyan" as const,
    },
    {
      label: "Average Fuel",
      value: `${average("fuel")}%`,
      delta: "Across reporting vehicles",
      trend: "up" as const,
      icon: Fuel,
      tone: "emerald" as const,
    },
    {
      label: "Needs Attention",
      value: attention.toString(),
      delta: "Health, fuel or breakdown",
      trend: attention ? ("down" as const) : ("up" as const),
      icon: AlertTriangle,
      tone: "warning" as const,
    },
  ];
  const chartData = trucks.map((truck) => ({
    month: truck.id,
    utilization: truck.status === "On Route" ? truck.health : 0,
  }));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assets"
        title="Fleet"
        description="Vehicle-level telemetry with predictive health scoring and driver assignments."
      />
      {error && <ErrorMessage />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => <KpiCard key={kpi.label} {...kpi} index={index} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <BlockSkeleton key={index} className="h-[208px]" />
            ))
          ) : trucks.length ? (
            trucks.map((truck, index) => (
              <article
                key={truck.id}
                className="glass glass-hover animate-rise rounded-2xl p-5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-primary">{truck.id}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {truck.driver} · {truck.model}
                    </p>
                  </div>
                  <StatusPill value={truck.status} />
                </div>
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <MeterBar value={truck.fuel} />
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <MeterBar value={truck.health} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{truck.route}</span>
                  </span>
                  <span className="shrink-0 font-mono tabular-nums">{truck.odometer}</span>
                </div>
              </article>
            ))
          ) : (
            <Empty text="No fleet records are available." />
          )}
        </div>
        <div className="space-y-4">
          <Panel title="Fleet Health" description="Current health of on-route units">
            {isLoading ? <ChartSkeleton /> : <FleetUtilizationChart data={chartData} />}
          </Panel>
          <Panel title="Maintenance Watchlist" description="Health, fuel and disruption signals">
            {trucks.filter(
              (truck) => truck.health < 80 || truck.fuel < 25 || truck.status === "Breakdown",
            ).length ? (
              <div className="space-y-3">
                {trucks
                  .filter(
                    (truck) => truck.health < 80 || truck.fuel < 25 || truck.status === "Breakdown",
                  )
                  .map((truck) => (
                    <div key={truck.id} className="rounded-xl border border-border bg-card/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold">{truck.id}</span>
                        <span className="text-[11px] font-semibold text-warning">
                          Health {truck.health}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {truck.status === "Breakdown"
                          ? "Breakdown requires immediate action."
                          : truck.fuel < 25
                            ? "Fuel replenishment recommended."
                            : "Service recommended based on health score."}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <Empty text="No maintenance alerts." />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
function ErrorMessage() {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      Unable to load fleet data. Check the API service and retry.
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>;
}
