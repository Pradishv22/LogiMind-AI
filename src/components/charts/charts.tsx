import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--popover-foreground)",
    boxShadow: "var(--shadow-card)",
  },
  cursor: { fill: "var(--muted)", opacity: 0.35 },
} as const;

function Grid() {
  return <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />;
}

export function DeliveriesChart({
  data,
}: {
  data: { day: string; delivered: number; planned: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barGap={6}>
        <defs>
          <linearGradient id="barPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <Grid />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} width={36} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="planned" fill="var(--muted)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="delivered" fill="url(#barPrimary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DelayTrendChart({
  data,
}: {
  data: { week: string; delays: number; predicted: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="delayFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--warning)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--warning)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Grid />
        <XAxis dataKey="week" {...axis} />
        <YAxis {...axis} width={36} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="delays"
          stroke="var(--warning)"
          strokeWidth={2}
          fill="url(#delayFill)"
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="var(--cyan)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FleetUtilizationChart({
  data,
}: {
  data: { month: string; utilization: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fleetFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Grid />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} width={36} domain={[0, 100]} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="var(--emerald)"
          strokeWidth={2.5}
          fill="url(#fleetFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SuccessRateChart({ data }: { data: { month: string; success: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <Grid />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} width={40} domain={[85, 100]} />
        <Tooltip {...tooltipStyle} />
        <Line
          type="monotone"
          dataKey="success"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--primary)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FuelChart({
  data,
}: {
  data: { month: string; litres: number; baseline: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fuelFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <Grid />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} width={56} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="litres"
          stroke="var(--cyan)"
          strokeWidth={2.5}
          fill="url(#fuelFill)"
        />
        <Line
          type="monotone"
          dataKey="baseline"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 6"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart({ data }: { data: { name: string; occupancy: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} {...axis} />
        <YAxis type="category" dataKey="name" {...axis} width={56} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="occupancy" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((d) => (
            <Cell
              key={d.name}
              fill={
                d.occupancy >= 90
                  ? "var(--destructive)"
                  : d.occupancy >= 70
                    ? "var(--warning)"
                    : "var(--emerald)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SavingsChart({ data }: { data: { month: string; savings: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <Grid />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} width={40} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="savings" fill="url(#savingsFill)" radius={[8, 8, 0, 0]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConfidenceGauge({ value }: { value: number }) {
  const data = [{ name: "confidence", value, fill: "var(--primary)" }];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadialBarChart
        data={data}
        innerRadius="72%"
        outerRadius="100%"
        startAngle={210}
        endAngle={-30}
      >
        <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={12} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
