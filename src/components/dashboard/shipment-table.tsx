import { StatusPill } from "@/components/common/status-pill";
import type { Shipment } from "@/lib/api";

export function ShipmentTable({ data }: { data: Shipment[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="pb-3 pr-4 font-semibold">Shipment ID</th>
            <th className="pb-3 pr-4 font-semibold">Origin</th>
            <th className="pb-3 pr-4 font-semibold">Destination</th>
            <th className="pb-3 pr-4 font-semibold">Priority</th>
            <th className="pb-3 pr-4 font-semibold">ETA</th>
            <th className="pb-3 pr-4 font-semibold">Progress</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr
              key={s.id}
              className="animate-rise border-t border-border/70 transition-colors hover:bg-card/70"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <td className="py-3 pr-4 font-mono text-xs font-bold text-primary">{s.id}</td>
              <td className="py-3 pr-4">{s.origin}</td>
              <td className="py-3 pr-4">{s.destination}</td>
              <td className="py-3 pr-4">
                <StatusPill value={s.priority} />
              </td>
              <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground">
                {s.eta}
              </td>
              <td className="py-3 pr-4 w-36">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-[width] duration-700"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </td>
              <td className="py-3">
                <StatusPill value={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
