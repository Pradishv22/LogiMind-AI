import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PackageSearch,
  Truck,
  Warehouse,
  BrainCircuit,
  BarChart3,
  Settings,
  ChevronLeft,
  Radar,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Shipments", url: "/shipments", icon: PackageSearch },
  { title: "Fleet", url: "/fleet", icon: Truck },
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "AI Decision Center", url: "/ai-decision-center", icon: BrainCircuit },
  { title: "Simulation Center", url: "/simulation-center", icon: FlaskConical },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-[width] duration-300",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
          <Radar className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold tracking-tight">LogiMind AI</p>
            <p className="truncate text-[11px] text-muted-foreground">Decision Intelligence</p>
          </div>
        )}
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              title={item.title}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r-full bg-[image:var(--gradient-primary)] transition-all duration-300",
                  active && "h-6",
                )}
              />
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active && "text-primary",
                )}
              />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-sidebar-border bg-[image:var(--gradient-surface)] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              AI Engine
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Autonomous mode active · 1,284 decisions today
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-sidebar-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")}
          />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
