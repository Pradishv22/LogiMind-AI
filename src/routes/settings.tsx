import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/common/page-header";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LogiMind AI" },
      {
        name: "description",
        content:
          "Configure autonomy thresholds, alerting and workspace preferences for LogiMind AI.",
      },
      { property: "og:title", content: "Settings — LogiMind AI" },
      { property: "og:description", content: "Autonomy thresholds, alerting and preferences." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { title: "Autonomous execution", desc: "Auto-apply decisions above 92% confidence.", on: true },
  { title: "Weather-aware routing", desc: "Ingest IMD alerts into route scoring.", on: true },
  {
    title: "Predictive maintenance",
    desc: "Flag vehicles before health drops under 60%.",
    on: true,
  },
  {
    title: "Cost-impact alerts",
    desc: "Notify when a decision exceeds ₹25,000 impact.",
    on: false,
  },
  { title: "Night-shift dispatch", desc: "Allow re-slotting into 22:00–06:00 windows.", on: false },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Tune how much authority the decision engine holds and how your team gets alerted."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Decision Engine" description="Autonomy and guardrails">
          <div className="space-y-3">
            {toggles.map((t) => (
              <div
                key={t.title}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <Switch defaultChecked={t.on} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Organisation" description="Account details">
          <div className="space-y-3 text-sm">
            {[
              ["Workspace", "Bharat Freight Systems"],
              ["Plan", "Enterprise · Unlimited nodes"],
              ["Region", "ap-south-1 (Mumbai)"],
              ["Owner", "Ananya Verma · Ops Director"],
              ["Engine model", "logimind-reasoner-v4"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card/50 px-4 py-3"
              >
                <span className="truncate text-muted-foreground">{k}</span>
                <span className="shrink-0 font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
