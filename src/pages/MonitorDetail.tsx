import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Toggle from "../components/Toggle";
import { monitorsApi } from "../api/endpoints";
import { formatDateTime, formatLatency, formatPercent } from "../utils/format";
import type { RecheckResponse } from "../api/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const windowOptions = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
] as const;

const tabs = [
  { key: "summary", label: "Summary" },
  { key: "checks", label: "Checks" },
  { key: "incidents", label: "Incidents/Alerts" },
  { key: "settings", label: "Settings" },
] as const;

const MonitorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [window, setWindow] = useState<"24h" | "7d" | "30d">("24h");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("summary");
  const [latestCheck, setLatestCheck] = useState<RecheckResponse | null>(null);

  const { data: monitor, isLoading: monitorLoading } = useQuery({
    queryKey: ["monitor", id],
    queryFn: () => monitorsApi.get(id ?? ""),
    enabled: Boolean(id),
  });

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["monitor-summary", id, window],
    queryFn: () => monitorsApi.summary(id ?? "", window),
    enabled: Boolean(id),
  });

  const recheckMutation = useMutation({
    mutationFn: (monitorId: string) => monitorsApi.recheck(monitorId),
    onSuccess: (response) => {
      setLatestCheck(response);
      queryClient.invalidateQueries({ queryKey: ["monitor", id] });
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const enableMutation = useMutation({
    mutationFn: ({ monitorId, enabled }: { monitorId: string; enabled: boolean }) =>
      monitorsApi.enable(monitorId, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitor", id] });
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const chartData = useMemo(() => {
    if (!summary) return [];
    const avg = summary.avgLatencyMs ?? 0;
    const p95 = summary.p95LatencyMs ?? 0;
    return [
      { name: "AVG", value: avg },
      { name: "P95", value: p95 },
    ];
  }, [summary]);

  if (monitorLoading || !monitor) {
    return (
      <AppLayout title="Monitor" subtitle="Detalhes do monitor">
        <Spinner />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={monitor.name}
      subtitle={monitor.url}
      breadcrumb={`Monitors / ${monitor.name}`}
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Enabled</span>
            <Toggle
              checked={monitor.enabled}
              onChange={(value) =>
                enableMutation.mutate({ monitorId: monitor.id, enabled: value })
              }
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => recheckMutation.mutate(monitor.id)}
            loading={recheckMutation.isPending}
          >
            Recheck
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Card title="Navegação">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {activeTab === "summary" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card title="Uptime">
                <div className="text-2xl font-semibold">
                  {summary ? formatPercent(summary.uptimePercent) : "--"}
                </div>
                <div className="text-xs text-white/60 mt-1">Janela selecionada</div>
              </Card>
              <Card title="Total checks">
                <div className="text-2xl font-semibold">
                  {summary ? summary.totalChecks : "--"}
                </div>
                <div className="text-xs text-white/60 mt-1">Execuções no período</div>
              </Card>
              <Card title="Failures">
                <div className="text-2xl font-semibold text-rose-200">
                  {summary ? summary.failures : "--"}
                </div>
                <div className="text-xs text-white/60 mt-1">Falhas acumuladas</div>
              </Card>
              <Card title="Latency">
                <div className="text-2xl font-semibold">
                  {summary ? formatLatency(summary.avgLatencyMs) : "--"}
                </div>
                <div className="text-xs text-white/60 mt-1">Média aproximada</div>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <Card title="Resumo de latência">
                {summaryLoading ? (
                  <Spinner />
                ) : summaryError || !summary ? (
                  <EmptyState
                    title="Sem dados suficientes"
                    subtitle="Aguarde novas execuções para gerar métricas."
                  />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                        <YAxis stroke="rgba(255,255,255,0.4)" />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.06)" }}
                          contentStyle={{
                            background: "rgba(12,19,36,0.9)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#e5f0ff",
                          }}
                        />
                        <Bar dataKey="value" fill="#6ec7ff" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-white/50 mt-3">
                      O p95 é calculado via ordenação no banco (aproximação).
                    </p>
                  </div>
                )}
              </Card>

              <Card title="Último recheck manual">
                <div className="space-y-3">
                  <div className="text-sm text-white/60">
                    Horário: {formatDateTime(latestCheck?.checkedAt)}
                  </div>
                  <div className="text-sm text-white/60">
                    Status code: {latestCheck?.statusCode ?? "--"}
                  </div>
                  <div className="text-sm text-white/60">
                    Latência: {formatLatency(latestCheck?.latencyMs ?? null)}
                  </div>
                  <div className="text-sm text-white/60">
                    Resultado: {latestCheck ? (latestCheck.success ? "UP" : "DOWN") : "--"}
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : null}

        {activeTab === "checks" ? (
          <div className="space-y-4">
            <Card title="Janela de análise">
              <div className="flex flex-wrap gap-2">
                {windowOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setWindow(option.value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      window === option.value
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Card>
            <Card title="Resumo de checks">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  Total: {summary?.totalChecks ?? "--"}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  Falhas: {summary?.failures ?? "--"}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  P95: {formatLatency(summary?.p95LatencyMs ?? null)}
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "incidents" ? (
          <Card title="Incidents/Alerts">
            <div className="space-y-3">
              <p className="text-sm text-white/60">
                Use a página de alerts para filtrar, reconhecer e acompanhar incidentes recentes.
              </p>
              <Button variant="outline" onClick={() => navigate("/alerts")}>
                Open alerts
              </Button>
            </div>
          </Card>
        ) : null}

        {activeTab === "settings" ? (
          <Card title="Settings">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-white/50">URL</div>
                <div className="text-sm">{monitor.url}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-white/50">Interval</div>
                <div className="text-sm">{monitor.intervalSec}s</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-white/50">Timeout</div>
                <div className="text-sm">{monitor.timeoutMs}ms</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xs text-white/50">Next check</div>
                <div className="text-sm">{formatDateTime(monitor.nextCheckAt)}</div>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default MonitorDetail;
