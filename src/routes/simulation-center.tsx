import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CloudRain,
  Construction,
  Flame,
  Fuel,
  Gauge,
  PackagePlus,
  TrafficCone,
  Truck,
  UserX,
  Warehouse,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { KpiCard, KpiSkeleton } from "@/components/common/kpi-card";
import { PageHeader, Panel } from "@/components/common/page-header";
import { BlockSkeleton } from "@/components/common/skeletons";
import { decisionQuery, runSimulation } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulation-center")({ component: SimulationCenter });

const scenarios = [
  {
    key: "truck-breakdown",
    title: "Truck Breakdown",
    description: "Vehicle health and recovery disruption.",
    icon: Truck,
  },
  {
    key: "heavy-rain",
    title: "Heavy Rain",
    description: "Severe weather affecting travel speed and route risk.",
    icon: CloudRain,
  },
  {
    key: "fuel-shortage",
    title: "Fuel Shortage",
    description: "Low fuel availability across active movement.",
    icon: Fuel,
  },
  {
    key: "road-closure",
    title: "Road Closure",
    description: "Arterial route unavailable, requiring alternate routing.",
    icon: Construction,
  },
  {
    key: "warehouse-fire",
    title: "Warehouse Fire",
    description: "Warehouse capacity and inbound-flow disruption.",
    icon: Flame,
  },
  {
    key: "traffic-congestion",
    title: "Traffic Congestion",
    description: "High traffic pressure on ETA and service levels.",
    icon: TrafficCone,
  },
  {
    key: "driver-unavailable",
    title: "Driver Unavailable",
    description: "Reduced driver availability impacts dispatch capacity.",
    icon: UserX,
  },
  {
    key: "warehouse-overflow",
    title: "Warehouse Overflow",
    description: "Inbound demand exceeds warehouse throughput.",
    icon: Warehouse,
  },
  {
    key: "vehicle-accident",
    title: "Vehicle Accident",
    description: "Fleet condition and network delay disruption.",
    icon: AlertTriangle,
  },
  {
    key: "high-demand-surge",
    title: "High Demand Surge",
    description: "Increased volume pressure across network operations.",
    icon: PackagePlus,
  },
] as const;

const predictionLabels: Record<string, string> = {
  delay: "Delay prediction",
  eta: "ETA prediction",
  breakdown: "Fleet breakdown",
  warehouse: "Warehouse congestion",
  route: "Route risk",
};

function SimulationCenter() {
  const queryClient = useQueryClient();
  const baseline = useQuery(decisionQuery());
  const simulation = useMutation({
    mutationFn: runSimulation,
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["shipments"] }),
        queryClient.invalidateQueries({ queryKey: ["fleet"] }),
        queryClient.invalidateQueries({ queryKey: ["warehouses"] }),
        queryClient.invalidateQueries({ queryKey: ["decision"] }),
      ]);
      toast.success("Simulation complete", {
        description: `${result.overallHealth} network assessment is ready.`,
      });
    },
    onError: () =>
      toast.error("Simulation failed", {
        description: "The Decision Engine could not complete this scenario.",
      }),
  });
  const before = baseline.data;
  const after = simulation.data;
  const loading = baseline.isLoading || simulation.isPending;
  const activeScenario = simulation.variables;
  const result = after ?? before;
  const kpis = result
    ? [
        {
          label: "Overall Score",
          value: result.overallScore === null ? "—" : `${result.overallScore}/100`,
          delta: after ? "Updated by simulation" : "Baseline",
          trend: (result.overallScore ?? 0) >= 70 ? ("up" as const) : ("down" as const),
          icon: Gauge,
          tone: "primary" as const,
        },
        {
          label: "Network Health",
          value: result.overallHealth,
          delta: after ? "Scenario result" : "Baseline",
          trend: result.overallHealth === "Healthy" ? ("up" as const) : ("down" as const),
          icon: Zap,
          tone: "emerald" as const,
        },
        {
          label: "Confidence",
          value: result.confidence === null ? "—" : `${result.confidence}%`,
          delta: "Engine confidence",
          trend: "up" as const,
          icon: AlertTriangle,
          tone: "cyan" as const,
        },
        {
          label: "Risk Level",
          value: result.riskLevel,
          delta: after ? "Reassessed" : "Baseline",
          trend: result.riskLevel === "Low" ? ("up" as const) : ("down" as const),
          icon: AlertTriangle,
          tone: "warning" as const,
        },
      ]
    : [];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="What-if Intelligence"
        title="Simulation Center"
        description="Run live ML and Gemini decision analysis against operational disruption scenarios."
      />
      {(baseline.error || simulation.error) && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to complete the simulation. Check the Decision Engine and Gemini configuration,
          then try again.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading && !result
          ? Array.from({ length: 4 }).map((_, index) => <KpiSkeleton key={index} />)
          : kpis.map((kpi, index) => (
              <KpiCard
                key={`${activeScenario ?? "baseline"}-${kpi.label}-${kpi.value}`}
                {...kpi}
                index={index}
              />
            ))}
      </div>
      <Panel
        title="Scenario Library"
        description="Each simulation runs the existing models with scenario-specific inputs, then requests a Gemini decision report."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon;
            const active = activeScenario === scenario.key;
            return (
              <article
                key={scenario.key}
                className={cn(
                  "glass glass-hover animate-rise rounded-2xl p-4",
                  active && "border-primary/50 shadow-[var(--shadow-glow)]",
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/25 bg-accent/12 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-3 text-sm font-bold">{scenario.title}</h2>
                <p className="mt-1 min-h-10 text-xs leading-relaxed text-muted-foreground">
                  {scenario.description}
                </p>
                <button
                  onClick={() => simulation.mutate(scenario.key)}
                  disabled={simulation.isPending}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap className="h-3.5 w-3.5" />{" "}
                  {active && simulation.isPending ? "Running…" : "Run simulation"}
                </button>
              </article>
            );
          })}
        </div>
      </Panel>
      {loading && !result ? (
        <BlockSkeleton className="h-96" />
      ) : result ? (
        <>
          <section className="grid gap-4 xl:grid-cols-2">
            <Panel
              title="Before / After Predictions"
              description={
                after
                  ? `Baseline compared with ${after.scenario ?? "simulated"} scenario`
                  : "Run a scenario to compare its output with the baseline."
              }
            >
              {after && before ? (
                <div className="space-y-3">
                  {Object.entries(predictionLabels).map(([key, label]) => (
                    <ComparisonRow
                      key={key}
                      label={label}
                      before={before.predictions[key]}
                      after={after.predictions[key]}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Select a scenario to generate a live before-and-after comparison.
                </p>
              )}
            </Panel>
            <Panel
              title="Executive Recommendations"
              description={`Generated ${new Date(result.generatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`}
            >
              <p className="text-sm leading-7 text-muted-foreground">{result.executiveSummary}</p>
              <RecommendationList title="Priority Actions" items={result.priorityActions} />
              <RecommendationList title="Recommendations" items={result.recommendations} />
            </Panel>
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <Panel title="Business Impact" description="Scenario-specific operational impact">
              <RecommendationList title="Impact assessment" items={result.businessImpact} />
            </Panel>
            <Panel title="Simulation Status" description="Automatic refreshes completed">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Decision Engine and Gemini report:{" "}
                  <span className="font-semibold text-success">complete</span>
                </p>
                <p>
                  Dashboard cache refresh:{" "}
                  <span className="font-semibold text-success">complete</span>
                </p>
                <p>
                  AI Decision Center cache refresh:{" "}
                  <span className="font-semibold text-success">complete</span>
                </p>
              </div>
            </Panel>
          </section>
        </>
      ) : null}
    </div>
  );
}

function ComparisonRow({
  label,
  before,
  after,
}: {
  label: string;
  before: unknown;
  after: unknown;
}) {
  return (
    <div className="grid gap-2 rounded-xl border border-border bg-card/50 p-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted-foreground">
        {JSON.stringify(before, null, 2)}
      </pre>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-primary">
        {JSON.stringify(after, null, 2)}
      </pre>
    </div>
  );
}
function RecommendationList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{title}</p>
      {items.length ? (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-2 text-sm leading-6 text-muted-foreground"
            >
              <span className="font-bold text-primary">{index + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          No items returned by the decision report.
        </p>
      )}
    </div>
  );
}
