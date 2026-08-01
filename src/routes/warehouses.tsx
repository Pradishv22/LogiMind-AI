import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Layers, PackageOpen, Percent } from "lucide-react";
import { OccupancyChart } from "@/components/charts/charts";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { BlockSkeleton, ChartSkeleton } from "@/components/common/skeletons";
import { WarehouseCard } from "@/components/dashboard/warehouse-card";
import { warehousesQuery } from "@/lib/api";

export const Route = createFileRoute("/warehouses")({ component: WarehousesPage });

function WarehousesPage() {
  const { data: warehouses = [], isLoading, error } = useQuery(warehousesQuery());
  const capacity = warehouses.reduce((sum, warehouse) => sum + warehouse.capacity, 0);
  const used = warehouses.reduce((sum, warehouse) => sum + warehouse.used, 0);
  const available = warehouses.reduce((sum, warehouse) => sum + warehouse.available, 0);
  const utilization = capacity ? Math.round((used / capacity) * 100) : 0;
  const kpis = [
    {
      label: "Total Nodes",
      value: warehouses.length.toString(),
      delta: "Live warehouse records",
      trend: "up" as const,
      icon: Boxes,
      tone: "primary" as const,
    },
    {
      label: "Network Utilization",
      value: `${utilization}%`,
      delta: `${used.toLocaleString("en-IN")} occupied`,
      trend: utilization > 85 ? ("down" as const) : ("up" as const),
      icon: Percent,
      tone: "emerald" as const,
    },
    {
      label: "Occupied Capacity",
      value: used.toLocaleString("en-IN"),
      delta: "Across all nodes",
      trend: "up" as const,
      icon: PackageOpen,
      tone: "cyan" as const,
    },
    {
      label: "Free Capacity",
      value: available.toLocaleString("en-IN"),
      delta: "Available volume",
      trend: "up" as const,
      icon: Layers,
      tone: "warning" as const,
    },
  ];
  const occupancy = warehouses.map((warehouse) => ({
    name: warehouse.id,
    occupancy: warehouse.capacity ? Math.round((warehouse.used / warehouse.capacity) * 100) : 0,
  }));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nodes"
        title="Warehouses"
        description="Capacity intelligence across regional warehouse hubs."
      />
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load warehouses. Check the API service and retry.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => <KpiCard key={kpi.label} {...kpi} index={index} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <BlockSkeleton key={index} className="h-[196px]" />
          ))
        ) : warehouses.length ? (
          warehouses.map((warehouse, index) => (
            <WarehouseCard key={warehouse.id} w={warehouse} index={index} />
          ))
        ) : (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No warehouses are available.
          </p>
        )}
      </div>
      <Panel title="Occupancy by Node" description="Percentage of reported usable volume consumed">
        {isLoading ? (
          <ChartSkeleton />
        ) : warehouses.length ? (
          <OccupancyChart data={occupancy} />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No occupancy data is available.
          </p>
        )}
      </Panel>
    </div>
  );
}
