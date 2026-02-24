import { apiClient } from "./client";
import type {
  AuthResponse,
  MeResponse,
  MonitorCreateRequest,
  MonitorResponse,
  MonitorSummaryResponse,
  MonitorUpdateRequest,
  EnableMonitorRequest,
  RecheckResponse,
  DashboardOverviewResponse,
  AlertItem,
} from "./types";

export const authApi = {
  register: async (payload: { email: string; password: string }) => {
    const { data } = await apiClient.post<AuthResponse>("/api/v1/auth/register", payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await apiClient.post<AuthResponse>("/api/v1/auth/login", payload);
    return data;
  },
  refresh: async () => {
    const { data } = await apiClient.post<AuthResponse>("/api/v1/auth/refresh");
    return data;
  },
  logout: async () => {
    await apiClient.post("/api/v1/auth/logout");
  },
  me: async () => {
    const { data } = await apiClient.get<MeResponse>("/api/v1/auth/me");
    return data;
  },
};

export const dashboardApi = {
  overview: async (window: "24h" | "7d" | "30d" = "7d") => {
    const { data } = await apiClient.get<DashboardOverviewResponse>(
      `/api/v1/dashboard/overview?window=${window}`
    );
    return data;
  },
};

export const monitorsApi = {
  list: async () => {
    const { data } = await apiClient.get<MonitorResponse[]>("/api/v1/monitors");
    return data;
  },
  get: async (id: string) => {
    const { data } = await apiClient.get<MonitorResponse>(`/api/v1/monitors/${id}`);
    return data;
  },
  create: async (payload: MonitorCreateRequest) => {
    const { data } = await apiClient.post<MonitorResponse>("/api/v1/monitors", payload);
    return data;
  },
  update: async (id: string, payload: MonitorUpdateRequest) => {
    const { data } = await apiClient.put<MonitorResponse>(`/api/v1/monitors/${id}`, payload);
    return data;
  },
  enable: async (id: string, payload: EnableMonitorRequest) => {
    const { data } = await apiClient.patch<MonitorResponse>(`/api/v1/monitors/${id}/enable`, payload);
    return data;
  },
  recheck: async (id: string) => {
    const { data } = await apiClient.post<RecheckResponse>(`/api/v1/monitors/${id}/recheck`);
    return data;
  },
  summary: async (id: string, window: "24h" | "7d" | "30d") => {
    const { data } = await apiClient.get<MonitorSummaryResponse>(
      `/api/v1/monitors/${id}/checks/summary?window=${window}`
    );
    return data;
  },
};

export const alertsApi = {
  list: async (status: "unacked" | "all" = "unacked") => {
    const { data } = await apiClient.get<AlertItem[]>(`/api/v1/alerts?status=${status}`);
    return data;
  },
  ack: async (alertId: string) => {
    const { data } = await apiClient.post<AlertItem>(`/api/v1/alerts/${alertId}/ack`);
    return data;
  },
};
