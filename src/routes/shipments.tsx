import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Filter, Package, PackageCheck, PackageX, Search } from "lucide-react";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { TableSkeleton } from "@/components/common/skeletons";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { shipmentsQuery } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shipments")({ component: ShipmentsPage });
const filters = ["All", "In Transit", "Delayed", "Loading", "Delivered"];

function ShipmentsPage() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const { data: shipments = [], isLoading, error } = useQuery(shipmentsQuery());
  const rows = useMemo(
    () =>
      shipments.filter(
        (shipment) =>
          (filter === "All" || shipment.status === filter) &&
          `${shipment.id} ${shipment.origin} ${shipment.destination}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [shipments, filter, query],
  );
  const delayed = shipments.filter((shipment) => shipment.status === "Delayed").length;
  const delivered = shipments.filter((shipment) => shipment.status === "Delivered").length;
  const exceptions = shipments.filter(
    (shipment) => shipment.status === "Rerouted" || shipment.status === "At Hub",
  ).length;
  const kpis = [
    {
      label: "Total Shipments",
      value: shipments.length.toString(),
      delta: "Live registry",
      trend: "up" as const,
      icon: Package,
      tone: "primary" as const,
    },
    {
      label: "Delivered",
      value: delivered.toString(),
      delta: "Completed loads",
      trend: "up" as const,
      icon: PackageCheck,
      tone: "emerald" as const,
    },
    {
      label: "Delayed",
      value: delayed.toString(),
      delta: "Requires monitoring",
      trend: delayed ? ("down" as const) : ("up" as const),
      icon: Clock,
      tone: "warning" as const,
    },
    {
      label: "Exceptions",
      value: exceptions.toString(),
      delta: "Rerouted or at hub",
      trend: exceptions ? ("down" as const) : ("up" as const),
      icon: PackageX,
      tone: "cyan" as const,
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network"
        title="Shipments"
        description="Live shipment records from the LogiMind AI backend."
      />
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load shipments. Check the API service and retry.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => <KpiCard key={kpi.label} {...kpi} index={index} />)}
      </div>
      <Panel
        title="Shipment Registry"
        description={`${rows.length} of ${shipments.length} shipments`}
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-48 rounded-xl border border-border bg-background/60 pl-8 pr-3 text-xs outline-none focus:border-primary sm:w-56"
              placeholder="Search shipments"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                filter === item && "border-primary bg-primary/10 text-primary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : rows.length ? (
          <ShipmentTable data={rows} />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No shipments match the selected filters.
          </p>
        )}
      </Panel>
    </div>
  );
}
