import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  IndianRupee,
  Package,
  RefreshCw,
  Timer,
  Truck,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import {
  DeliveriesChart,
  DelayTrendChart,
  FleetUtilizationChart,
} from "@/components/charts/charts";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { BlockSkeleton, ChartSkeleton, TableSkeleton } from "@/components/common/skeletons";
import { FleetStatusPanel } from "@/components/dashboard/fleet-status-panel";
import { IndiaRouteMap } from "@/components/dashboard/india-route-map";
import { ShipmentTable } from "@/components/dashboard/shipment-table";
import { WarehouseCard } from "@/components/dashboard/warehouse-card";
import { dashboardQuery, fleetQuery, shipmentsQuery, warehousesQuery } from "@/lib/api";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const queryClient = useQueryClient();
  const dashboard = useQuery(dashboardQuery());
  const shipments = useQuery(shipmentsQuery());
  const fleet = useQuery(fleetQuery());
  const warehouses = useQuery(warehousesQuery());
  const loading =
    dashboard.isLoading || shipments.isLoading || fleet.isLoading || warehouses.isLoading;
  const error = dashboard.error || shipments.error || fleet.error || warehouses.error;
  const overview = dashboard.data;
  const shipmentRows = shipments.data ?? [];
  const fleetRows = fleet.data ?? [];
  const warehouseRows = warehouses.data ?? [];
  const kpis = overview
    ? [
        {
          label: "Total Shipments",
          value: overview.totalShipments.toLocaleString("en-IN"),
          delta: `${overview.delayedShipments} delayed`,
          trend: overview.delayedShipments ? ("down" as const) : ("up" as const),
          icon: Package,
          tone: "primary" as const,
        },
        {
          label: "Active Fleet",
          value: overview.activeFleet.toLocaleString("en-IN"),
          delta: `${overview.fleetCount} total`,
          trend: "up" as const,
          icon: Truck,
          tone: "cyan" as const,
        },
        {
          label: "Warehouse Nodes",
          value: overview.warehouseCount.toLocaleString("en-IN"),
          delta: `${overview.highRiskWarehouses} high risk`,
          trend: overview.highRiskWarehouses ? ("down" as const) : ("up" as const),
          icon: WarehouseIcon,
          tone: "emerald" as const,
        },
        {
          label: "Delayed Shipments",
          value: overview.delayedShipments.toLocaleString("en-IN"),
          delta: "Live network count",
          trend: overview.delayedShipments ? ("down" as const) : ("up" as const),
          icon: Timer,
          tone: "warning" as const,
        },
      ]
    : [];
  const statusData = ["In Transit", "Delayed", "Delivered", "At Hub", "Rerouted"].map((status) => ({
    day: status,
    delivered: shipmentRows.filter((item) => item.status === status).length,
    planned: shipmentRows.length,
  }));
  const riskData = fleetRows.map((truck) => ({
    week: truck.id,
    delays: Math.max(0, 100 - truck.health),
    predicted: Math.max(0, 100 - truck.fuel),
  }));
  const utilizationData = warehouseRows.map((warehouse) => ({
    month: warehouse.id,
    utilization: warehouse.capacity ? Math.round((warehouse.used / warehouse.capacity) * 100) : 0,
  }));
  const refresh = () =>
    void Promise.all(
      ["dashboard", "shipments", "fleet", "warehouses"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command Center"
        title="Operations Dashboard"
        description="Live operational data across shipments, fleet and warehouse nodes."
        actions={
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> Refresh
          </button>
        }
      />
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load live operations data. Check that the API service is running, then retry.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => <KpiCard key={kpi.label} {...kpi} index={index} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Live Route Network — India"
          description="Hover a corridor for shipment detail"
        >
          {loading ? (
            <BlockSkeleton className="h-[440px]" />
          ) : (
            <IndiaRouteMap shipments={shipmentRows} />
          )}
        </Panel>
        <Panel title="Fleet Status" description="Live vehicle telemetry">
          {loading ? (
            <BlockSkeleton className="h-[440px]" />
          ) : fleetRows.length ? (
            <FleetStatusPanel data={fleetRows} limit={6} />
          ) : (
            <EmptyState text="No fleet records available." />
          )}
        </Panel>
      </div>
      <Panel title="Shipment Registry" description={`${shipmentRows.length} live shipments`}>
        {loading ? (
          <TableSkeleton />
        ) : shipmentRows.length ? (
          <ShipmentTable data={shipmentRows} />
        ) : (
          <EmptyState text="No shipments available." />
        )}
      </Panel>
      <div>
        <h2 className="mb-3 text-sm font-bold tracking-tight">Warehouse Capacity</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <BlockSkeleton key={index} className="h-[196px]" />
            ))
          ) : warehouseRows.length ? (
            warehouseRows.map((warehouse, index) => (
              <WarehouseCard key={warehouse.id} w={warehouse} index={index} />
            ))
          ) : (
            <EmptyState text="No warehouses available." />
          )}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Shipment Status" description="Current live distribution">
          {loading ? <ChartSkeleton /> : <DeliveriesChart data={statusData} />}
        </Panel>
        <Panel title="Fleet Health Signals" description="Health and fuel risk by vehicle">
          {loading ? <ChartSkeleton /> : <DelayTrendChart data={riskData} />}
        </Panel>
        <Panel title="Warehouse Utilization" description="Current occupied capacity">
          {loading ? <ChartSkeleton /> : <FleetUtilizationChart data={utilizationData} />}
        </Panel>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-10 text-center text-sm text-muted-foreground">{text}</p>;
}
