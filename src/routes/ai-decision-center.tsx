import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Clock3, RefreshCw, ShieldAlert, Sparkles, Target } from "lucide-react";
import { PageHeader, Panel } from "@/components/common/page-header";
import { BlockSkeleton } from "@/components/common/skeletons";
import { decisionQuery, requestDecision } from "@/lib/api";

export const Route = createFileRoute("/ai-decision-center")({ component: AiDecisionCenter });

const predictionLabels: Record<string, string> = {
  delay: "Delay Prediction",
  eta: "ETA Prediction",
  breakdown: "Fleet Breakdown",
  warehouse: "Warehouse Congestion",
  route: "Route Risk",
};

function AiDecisionCenter() {
  const decision = useQuery(decisionQuery());
  const refresh = useMutation({
    mutationFn: requestDecision,
    onSuccess: () => void decision.refetch(),
  });
  const data = refresh.data ?? decision.data;
  const loading = decision.isLoading || refresh.isPending;
  const generatedAt = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Autonomous Operations"
        title="AI Decision Center"
        description="Live ML predictions and Gemini recommendations from the LogiMind decision engine."
        actions={
          <button
            onClick={() => refresh.mutate()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold hover:border-primary/50 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} /> Run
            analysis
          </button>
        }
      />
      {(decision.error || refresh.error) && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          The decision engine could not be reached. Verify the API, Python runtime, and Gemini
          configuration, then retry.
        </div>
      )}
      {loading ? (
        <div className="space-y-4">
          <BlockSkeleton className="h-40" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <BlockSkeleton key={index} className="h-48" />
            ))}
          </div>
        </div>
      ) : data ? (
        <>
          <section className="glass relative overflow-hidden rounded-3xl p-6">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
                  <BrainCircuit className="h-6 w-6 text-primary-foreground" />
                </span>
                <div>
                  <p className="text-lg font-extrabold tracking-tight">Live Decision Report</p>
                  <p className="text-xs text-muted-foreground">Generated {generatedAt}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs font-semibold text-success">
                <span className="h-2 w-2 rounded-full bg-success" /> Engine response received
              </span>
            </div>
            <div className="relative mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                label="Overall Health"
                value={data.success ? "Available" : "Unavailable"}
                icon={ShieldAlert}
              />
              <Metric label="Overall Score" value="Not provided by engine" icon={Target} />
              <Metric label="Confidence" value="Not provided by engine" icon={Sparkles} />
              <Metric label="Generated Time" value={generatedAt} icon={Clock3} />
            </div>
          </section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(predictionLabels).map(([key, label]) => (
              <PredictionCard key={key} label={label} prediction={data.mlPrediction[key]} />
            ))}
            <PredictionCard label="Risk Level" prediction={data.mlPrediction.route} />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Business Impact" description="Decision-engine interpretation">
              <ReportText text={data.aiRecommendation} />
            </Panel>
            <Panel
              title="Recommendations & Priority Actions"
              description="Gemini-generated operational report"
            >
              <ReportText text={data.aiRecommendation} />
            </Panel>
          </div>
        </>
      ) : (
        <Panel title="Decision engine" description="No analysis has been generated yet.">
          <p className="py-10 text-center text-sm text-muted-foreground">
            Run analysis to retrieve current ML predictions and recommendations.
          </p>
        </Panel>
      )}
    </div>
  );
}

function PredictionCard({ label, prediction }: { label: string; prediction: unknown }) {
  return (
    <article className="glass rounded-2xl p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{label}</p>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-muted-foreground">
        {prediction === undefined ? "No result provided." : JSON.stringify(prediction, null, 2)}
      </pre>
    </article>
  );
}
function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Target;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-4">
      <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-2 text-base font-extrabold tracking-tight text-primary">{value}</p>
    </div>
  );
}
function ReportText({ text }: { text: string }) {
  return (
    <div className="max-h-[420px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
      {text || "No recommendation text was returned."}
    </div>
  );
}
