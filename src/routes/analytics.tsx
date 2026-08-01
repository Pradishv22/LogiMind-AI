import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, Droplets, IndianRupee, Timer } from "lucide-react";
import {
  DelayTrendChart,
  FuelChart,
  OccupancyChart,
  SuccessRateChart,
} from "@/components/charts/charts";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { ChartSkeleton } from "@/components/common/skeletons";
import { fleetQuery, shipmentsQuery, warehousesQuery } from "@/lib/api";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  const shipments = useQuery(shipmentsQuery());
  const fleet = useQuery(fleetQuery());
  const warehouses = useQuery(warehousesQuery());
  const loading = shipments.isLoading || fleet.isLoading || warehouses.isLoading;
  const shipmentRows = shipments.data ?? [];
  const fleetRows = fleet.data ?? [];
  const warehouseRows = warehouses.data ?? [];
  const delivered = shipmentRows.filter((item) => item.status === "Delivered").length;
  const success = shipmentRows.length ? Math.round((delivered / shipmentRows.length) * 100) : 0;
  const delayed = shipmentRows.filter((item) => item.status === "Delayed").length;
  const averageFuel = fleetRows.length
    ? Math.round(fleetRows.reduce((sum, item) => sum + item.fuel, 0) / fleetRows.length)
    : 0;
  const capacity = warehouseRows.reduce((sum, item) => sum + item.capacity, 0);
  const used = warehouseRows.reduce((sum, item) => sum + item.used, 0);
  const kpis = [
    {
      label: "Delivery Success",
      value: `${success}%`,
      delta: `${delivered} delivered`,
      trend: "up" as const,
      icon: Activity,
      tone: "emerald" as const,
    },
    {
      label: "Delayed Shipments",
      value: delayed.toString(),
      delta: "Current registry",
      trend: delayed ? ("down" as const) : ("up" as const),
      icon: Timer,
      tone: "cyan" as const,
    },
    {
      label: "Average Fuel",
      value: `${averageFuel}%`,
      delta: "Reporting fleet",
      trend: "up" as const,
      icon: Droplets,
      tone: "primary" as const,
    },
    {
      label: "Warehouse Utilization",
      value: `${capacity ? Math.round((used / capacity) * 100) : 0}%`,
      delta: "Current capacity",
      trend: "up" as const,
      icon: IndianRupee,
      tone: "warning" as const,
    },
  ];
  const shipmentData = shipmentRows.map((item) => ({
    month: item.id,
    success: item.status === "Delivered" ? 100 : 0,
  }));
  const delayData = shipmentRows.map((item) => ({
    week: item.id,
    delays: item.status === "Delayed" ? 1 : 0,
    predicted: item.status === "Rerouted" ? 1 : 0,
  }));
  const fuelData = fleetRows.map((item) => ({
    month: item.id,
    litres: item.fuel,
    baseline: item.health,
  }));
  const occupancyData = warehouseRows.map((item) => ({
    name: item.id,
    occupancy: item.capacity ? Math.round((item.used / item.capacity) * 100) : 0,
  }));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Intelligence"
        title="Analytics"
        description="Current operational measures derived from live logistics data."
      />
      {(shipments.error || fleet.error || warehouses.error) && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Some analytics data could not be loaded. Check the API service and retry.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => <KpiCard key={kpi.label} {...kpi} index={index} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Delivery Completion" description="Current records, not historical trend">
          {loading ? <ChartSkeleton /> : <SuccessRateChart data={shipmentData} />}
        </Panel>
        <Panel title="Delay & Reroute Signals" description="Current shipment status">
          {loading ? <ChartSkeleton /> : <DelayTrendChart data={delayData} />}
        </Panel>
        <Panel title="Fleet Fuel & Health" description="Reported vehicle telemetry">
          {loading ? <ChartSkeleton /> : <FuelChart data={fuelData} />}
        </Panel>
        <Panel title="Warehouse Occupancy" description="Utilisation per node">
          {loading ? <ChartSkeleton /> : <OccupancyChart data={occupancyData} />}
        </Panel>
      </div>
    </div>
  );
}
