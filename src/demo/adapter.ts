import { AxiosError } from "axios";
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import type { AlertItem, MonitorResponse } from "../api/types";

export function createDemoAdapter(): AxiosAdapter {
  const stamp = () => new Date().toISOString();
  const monitors: MonitorResponse[] = [
    { id: "demo-catalog", name: "Catálogo de exemplo", url: "https://catalog.example.com/health", intervalSec: 60, timeoutMs: 5000, enabled: true, lastStatus: "UP", lastLatencyMs: 124, lastCheckedAt: stamp(), nextCheckAt: null, createdAt: stamp(), updatedAt: stamp() },
    { id: "demo-checkout", name: "Checkout de exemplo", url: "https://checkout.example.com/health", intervalSec: 60, timeoutMs: 5000, enabled: true, lastStatus: "DOWN", lastLatencyMs: 5000, lastCheckedAt: stamp(), nextCheckAt: null, createdAt: stamp(), updatedAt: stamp() },
    { id: "demo-notices", name: "Notificações de exemplo", url: "https://notices.example.com/health", intervalSec: 120, timeoutMs: 5000, enabled: false, lastStatus: "UNKNOWN", lastLatencyMs: null, lastCheckedAt: null, nextCheckAt: null, createdAt: stamp(), updatedAt: stamp() },
  ];
  const alerts: AlertItem[] = [{ id: "demo-alert", incidentId: "demo-incident", monitorId: "demo-checkout", event: "MONITOR_DOWN", status: "UNACKED", channel: "IN_APP", createdAt: stamp(), ackedAt: null }];

  return async (config: InternalAxiosRequestConfig) => {
    const url = new URL(config.url ?? "", "https://portfolio.invalid");
    const path = url.pathname;
    const method = (config.method ?? "get").toUpperCase();
    const reply = (data: unknown) => ({ data: structuredClone(data), status: 200, statusText: "OK", headers: {}, config });
    const fail = (status: number, message: string): never => {
      throw new AxiosError(message, "ERR_BAD_REQUEST", config, undefined, { ...reply({ message }), status });
    };
    const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data ?? {};

    // This adapter is a closed sandbox: unknown requests fail and never reach a network adapter.
    if (path === "/api/v1/auth/refresh") return reply({ accessToken: "demo-only-not-a-real-token", tokenType: "Bearer" });
    if (path === "/api/v1/auth/me") return reply({ id: "portfolio-visitor", email: "visitante@example.com", role: "DEMO" });
    if (path === "/api/v1/auth/logout") return reply({});
    if (path.startsWith("/api/v1/auth/")) fail(400, "Saia da demonstração para usar uma conta real.");
    if (path === "/api/v1/dashboard/overview") return reply({
      totals: { monitorsTotal: monitors.length, monitorsUp: monitors.filter(m => m.enabled && m.lastStatus === "UP").length, monitorsDown: monitors.filter(m => m.enabled && m.lastStatus === "DOWN").length, incidentsOpen: alerts.filter(a => a.status === "UNACKED").length },
      latestAlerts: alerts,
      worstMonitors: monitors.filter(m => m.enabled).map(m => ({ monitorId: m.id, name: m.name, uptimePercent: m.lastStatus === "DOWN" ? 96.4 : 99.9, totalChecks: 1000 })),
    });
    if (path === "/api/v1/monitors" && method === "GET") return reply(monitors);
    if (path === "/api/v1/monitors" && method === "POST") {
      const monitor: MonitorResponse = { id: crypto.randomUUID(), name: body.name, url: body.url, intervalSec: body.intervalSec, timeoutMs: body.timeoutMs, enabled: body.enabled ?? true, lastStatus: "UNKNOWN", lastLatencyMs: null, lastCheckedAt: null, nextCheckAt: null, createdAt: stamp(), updatedAt: stamp() };
      monitors.push(monitor);
      return reply(monitor);
    }
    const match = path.match(/^\/api\/v1\/monitors\/([^/]+)(.*)$/);
    if (match) {
      const monitor = monitors.find(m => m.id === match[1]);
      if (!monitor) return fail(404, "Monitor demonstrativo não encontrado.");
      if (match[2] === "/checks/summary") return reply({ uptimePercent: monitor.lastStatus === "DOWN" ? 96.4 : 99.9, totalChecks: 1000, failures: monitor.lastStatus === "DOWN" ? 36 : 1, avgLatencyMs: monitor.lastLatencyMs, p95LatencyMs: monitor.lastLatencyMs });
      if (match[2] === "/recheck" && method === "POST") {
        monitor.lastStatus = "UP"; monitor.lastLatencyMs = 120; monitor.lastCheckedAt = stamp(); monitor.updatedAt = stamp();
        return reply({ success: true, statusCode: 200, latencyMs: 120, errorMessage: null, checkedAt: monitor.lastCheckedAt });
      }
      if (match[2] === "/enable" && method === "PATCH") { monitor.enabled = Boolean(body.enabled); return reply(monitor); }
      if (!match[2] && method === "PUT") {
        for (const field of ["name", "url", "intervalSec", "timeoutMs", "enabled"] as const) {
          if (field in body) Object.assign(monitor, { [field]: body[field] });
        }
        monitor.updatedAt = stamp(); return reply(monitor);
      }
      if (!match[2] && method === "GET") return reply(monitor);
    }
    if (path === "/api/v1/alerts" && method === "GET") return reply(url.searchParams.get("status") === "all" ? alerts : alerts.filter(a => a.status === "UNACKED"));
    const ack = path.match(/^\/api\/v1\/alerts\/([^/]+)\/ack$/);
    if (ack && method === "POST") {
      const alert = alerts.find(a => a.id === ack[1]);
      if (!alert) return fail(404, "Alerta demonstrativo não encontrado.");
      alert.status = "ACKED"; alert.ackedAt = stamp(); return reply(alert);
    }
    return fail(404, "Operação fora do escopo da demonstração.");
  };
}
