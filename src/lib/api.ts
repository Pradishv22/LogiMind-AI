import { queryOptions } from "@tanstack/react-query";

export type ShipmentStatus =
  "In Transit" | "Delayed" | "Delivered" | "At Hub" | "Rerouted" | "Loading" | string;
export type Priority = "Critical" | "High" | "Medium" | "Low" | string;

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  priority: Priority;
  eta: string;
  status: ShipmentStatus;
  progress: number;
}
export interface Truck {
  id: string;
  driver: string;
  fuel: number;
  health: number;
  status: string;
  route: string;
  odometer: string;
  model: string;
  risk?: string;
}
export interface Warehouse {
  id: string;
  name: string;
  city: string;
  capacity: number;
  used: number;
  available: number;
  risk?: string;
  temperature?: number;
}
export interface DashboardResponse {
  totalShipments: number;
  fleetCount: number;
  warehouseCount: number;
  delayedShipments: number;
  activeFleet: number;
  highRiskWarehouses: number;
}
export interface DecisionResponse {
  success: boolean;
  generatedAt: string;
  scenario?: string;
  overallScore: number | null;
  overallHealth: string;
  confidence: number | null;
  riskLevel: string;
  predictions: Record<string, unknown>;
  businessImpact: string[];
  recommendations: string[];
  priorityActions: string[];
  executiveSummary: string;
  mlPrediction: Record<string, unknown>;
  aiRecommendation: string;
}

const apiUrl = (path: string) => `${import.meta.env.VITE_API_URL ?? ""}${path}`;
async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${path}`);
  return (await response.json()) as T;
}
async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${path}`);
  return (await response.json()) as T;
}
const queryString = (filters: Record<string, string | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "All") params.set(key, value);
  });
  const value = params.toString();
  return value ? `?${value}` : "";
};

export const dashboardQuery = () =>
  queryOptions({
    queryKey: ["dashboard"],
    queryFn: () => getJson<DashboardResponse>("/api/dashboard"),
    staleTime: 15_000,
  });
export const shipmentsQuery = (filters: { q?: string; status?: string; priority?: string } = {}) =>
  queryOptions({
    queryKey: ["shipments", filters],
    queryFn: () => getJson<Shipment[]>(`/api/shipments${queryString(filters)}`),
    staleTime: 15_000,
  });
export const fleetQuery = (filters: { q?: string; status?: string } = {}) =>
  queryOptions({
    queryKey: ["fleet", filters],
    queryFn: () => getJson<Truck[]>(`/api/fleet${queryString(filters)}`),
    staleTime: 15_000,
  });

type WarehouseApiRow = {
  id: string;
  city: string;
  capacity: number;
  occupied: number;
  available: number;
  temperature?: number;
  risk?: string;
};
export const warehousesQuery = (filters: { q?: string; zone?: string } = {}) =>
  queryOptions({
    queryKey: ["warehouses", filters],
    queryFn: async () =>
      (await getJson<WarehouseApiRow[]>(`/api/warehouses${queryString(filters)}`)).map((row) => ({
        id: row.id,
        name: `${row.city} Hub`,
        city: row.city,
        capacity: Number(row.capacity) || 0,
        used: Number(row.occupied) || 0,
        available: Number(row.available) || 0,
        temperature: row.temperature,
        risk: row.risk,
      })),
    staleTime: 15_000,
  });
export const decisionQuery = () =>
  queryOptions({
    queryKey: ["decision"],
    queryFn: () => getJson<DecisionResponse>("/api/decision"),
    staleTime: 60_000,
  });
export const requestDecision = () => getJson<DecisionResponse>("/api/decision");
export const runSimulation = (scenario: string) =>
  postJson<DecisionResponse>("/api/decision", { scenario });
