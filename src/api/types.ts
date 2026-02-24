export type AuthResponse = {
  accessToken: string;
  tokenType: string;
};

export type MeResponse = {
  id: string;
  email: string;
  role: string;
};

export type MonitorResponse = {
  id: string;
  name: string;
  url: string;
  intervalSec: number;
  timeoutMs: number;
  enabled: boolean;
  lastStatus: "UP" | "DOWN" | "UNKNOWN" | null;
  lastLatencyMs: number | null;
  lastCheckedAt: string | null;
  nextCheckAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MonitorCreateRequest = {
  name: string;
  url: string;
  intervalSec: number;
  timeoutMs: number;
  enabled?: boolean;
};

export type MonitorUpdateRequest = {
  name?: string;
  url?: string;
  intervalSec?: number;
  timeoutMs?: number;
  enabled?: boolean;
};

export type EnableMonitorRequest = {
  enabled: boolean;
};

export type RecheckResponse = {
  success: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  errorMessage: string | null;
  checkedAt: string;
};

export type MonitorSummaryResponse = {
  uptimePercent: number;
  totalChecks: number;
  failures: number;
  avgLatencyMs: number | null;
  p95LatencyMs: number | null;
};

export type DashboardOverviewResponse = {
  totals: {
    monitorsTotal: number;
    monitorsUp: number;
    monitorsDown: number;
    incidentsOpen: number;
  };
  latestAlerts: AlertItem[];
  worstMonitors: WorstMonitorItem[];
};

export type AlertItem = {
  id: string;
  incidentId: string;
  monitorId: string;
  event: string;
  status: string;
  channel: string | null;
  createdAt: string;
  ackedAt: string | null;
};

export type WorstMonitorItem = {
  monitorId: string;
  name: string;
  uptimePercent: number;
  totalChecks: number;
};
