import { Bell, Search, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardQuery } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const { data: dashboard } = useQuery(dashboardQuery());

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-3">
        <div className="relative min-w-0 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search shipments, trucks, warehouses…"
            className="h-10 w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 lg:flex">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {now
                ? now.toLocaleString("en-IN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })
                : "—"}{" "}
              IST
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-[18px] w-[18px]" />
              {(dashboard?.delayedShipments ?? 0) > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="py-3 text-muted-foreground">
                {dashboard
                  ? `${dashboard.delayedShipments} delayed shipments require attention.`
                  : "Live alerts are loading."}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-xl border border-border bg-card/60 py-1.5 pl-1.5 pr-3 transition-colors hover:border-primary/40">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-emerald)] text-xs font-bold text-primary-foreground">
                AV
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold leading-tight">Ananya Verma</span>
                <span className="block text-[10px] leading-tight text-muted-foreground">
                  Ops Director
                </span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
