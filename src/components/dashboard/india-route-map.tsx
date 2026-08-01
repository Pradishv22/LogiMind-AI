import { useMemo, useState } from "react";
import type { Shipment } from "@/lib/api";
import { cn } from "@/lib/utils";

const INDIA_PATH =
  "M198 108 L215 96 L232 112 L250 106 L262 124 L282 132 L300 120 L318 132 L330 118 L344 130 L336 152 L352 160 L360 186 L344 196 L352 214 L336 228 L330 254 L318 284 L306 268 L296 292 L282 286 L270 300 L262 330 L256 366 L248 400 L238 436 L222 470 L192 496 L174 436 L160 396 L146 352 L134 314 L128 280 L120 252 L128 226 L142 208 L160 196 L168 172 L182 150 L176 128 Z";
const cities: Record<string, { x: number; y: number }> = {
  Delhi: { x: 218, y: 168 },
  Jaipur: { x: 178, y: 200 },
  Ahmedabad: { x: 140, y: 268 },
  Mumbai: { x: 150, y: 340 },
  Pune: { x: 168, y: 358 },
  Goa: { x: 162, y: 392 },
  Bengaluru: { x: 196, y: 424 },
  Kochi: { x: 186, y: 470 },
  Chennai: { x: 228, y: 428 },
  Hyderabad: { x: 208, y: 366 },
  Nagpur: { x: 226, y: 300 },
  Kolkata: { x: 318, y: 272 },
  Lucknow: { x: 254, y: 206 },
  Patna: { x: 290, y: 226 },
  Indore: { x: 178, y: 268 },
  Surat: { x: 146, y: 300 },
};
const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return `M${a.x} ${a.y} Q${mx + (-dy / length) * length * 0.18} ${my + (dx / length) * length * 0.18} ${b.x} ${b.y}`;
};
const color = (status: string) =>
  status === "Delayed"
    ? "var(--warning)"
    : status === "Rerouted"
      ? "var(--emerald)"
      : "var(--primary)";

export function IndiaRouteMap({ shipments }: { shipments: Shipment[] }) {
  const [active, setActive] = useState<string | null>(null);
  const routes = useMemo(
    () => shipments.filter((shipment) => cities[shipment.origin] && cities[shipment.destination]),
    [shipments],
  );
  const activeShipment = routes.find((shipment) => shipment.id === active);
  return (
    <div className="relative">
      <div className="grid-noise pointer-events-none absolute inset-0 rounded-xl opacity-40" />
      <svg
        viewBox="0 0 420 540"
        className="relative h-[440px] w-full"
        role="img"
        aria-label="Live shipment routes across India"
      >
        <defs>
          <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path
          d={INDIA_PATH}
          fill="url(#landFill)"
          stroke="var(--cyan)"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {routes.map((shipment) => {
          const from = cities[shipment.origin]!;
          const to = cities[shipment.destination]!;
          const isActive = shipment.id === active;
          const path = arc(from, to);
          return (
            <g
              key={shipment.id}
              onMouseEnter={() => setActive(shipment.id)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
            >
              <path d={path} stroke="transparent" strokeWidth="14" fill="none" />
              <path
                d={path}
                stroke={color(shipment.status)}
                strokeWidth={isActive ? 2.6 : 1.6}
                fill="none"
                strokeLinecap="round"
                opacity={active && !isActive ? 0.25 : 0.95}
                className="route-dash transition-all duration-300"
              />
              <circle r="3.4" fill={color(shipment.status)}>
                <animateMotion dur="7s" repeatCount="indefinite" path={path} />
              </circle>
            </g>
          );
        })}
        {Object.entries(cities).map(([name, point]) => (
          <g key={name}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--background)"
              stroke="var(--cyan)"
              strokeWidth="1.6"
            />
            <text
              x={point.x + 8}
              y={point.y + 3.5}
              className="fill-muted-foreground text-[9px]"
              style={{ fontSize: 9 }}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
      <div
        className={cn(
          "pointer-events-none absolute right-4 top-4 w-56 rounded-xl border border-border bg-popover/90 p-3 backdrop-blur-xl transition-all duration-300",
          activeShipment ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
        )}
      >
        {activeShipment && (
          <>
            <p className="font-mono text-xs font-bold text-primary">{activeShipment.id}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeShipment.origin} → {activeShipment.destination}
            </p>
            <p className="mt-2 text-xs">
              ETA <span className="font-semibold">{activeShipment.eta}</span>
            </p>
          </>
        )}
      </div>
      {routes.length === 0 && (
        <p className="absolute inset-x-0 bottom-4 text-center text-sm text-muted-foreground">
          No mappable live routes are available.
        </p>
      )}
    </div>
  );
}
