import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Toggle from "../components/Toggle";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import { monitorsApi } from "../api/endpoints";
import type { MonitorCreateRequest, MonitorResponse } from "../api/types";
import { formatDateTime, formatLatency } from "../utils/format";
import { Link } from "react-router-dom";

const defaultForm: MonitorCreateRequest = {
  name: "",
  url: "",
  intervalSec: 60,
  timeoutMs: 5000,
  enabled: true,
};

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const Monitors = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["monitors"],
    queryFn: async () => {
      const next = await monitorsApi.list();
      const prev = queryClient.getQueryData<MonitorResponse[]>(["monitors"]);
      if (!prev) return next;
      return next.map((monitor) => {
        const previous = prev.find((item) => item.id === monitor.id);
        if (!previous) return monitor;
        return {
          ...monitor,
          lastStatus: monitor.lastStatus ?? previous.lastStatus,
          lastLatencyMs: monitor.lastLatencyMs ?? previous.lastLatencyMs,
          lastCheckedAt: monitor.lastCheckedAt ?? previous.lastCheckedAt,
        };
      });
    },
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    staleTime: 5000,
    placeholderData: (previous) => previous,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<MonitorCreateRequest>(defaultForm);
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "up" | "down" | "unknown">("all");
  const createMutation = useMutation({
    mutationFn: (payload: MonitorCreateRequest) => monitorsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      setModalOpen(false);
      setForm(defaultForm);
    },
  });

  const enableMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      monitorsApi.enable(id, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const applyRecheckResult = (monitorId: string, result: Awaited<ReturnType<typeof monitorsApi.recheck>>) => {
    queryClient.setQueryData<MonitorResponse[]>(["monitors"], (current) => {
      if (!current) return current;
      return current.map((monitor) =>
        monitor.id === monitorId
          ? {
              ...monitor,
              lastStatus: result.success ? "UP" : "DOWN",
              lastLatencyMs: result.latencyMs,
              lastCheckedAt: result.checkedAt,
            }
          : monitor
      );
    });
  };

  const recheckMutation = useMutation({
    mutationFn: (id: string) => monitorsApi.recheck(id),
    onSuccess: (result, id) => {
      applyRecheckResult(id, result);
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const recheckAllMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(
        ids.map(async (id) => ({ id, result: await monitorsApi.recheck(id) }))
      );
      return results;
    },
    onSuccess: (results) => {
      results.forEach(({ id, result }) => applyRecheckResult(id, result));
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const handleCreate = () => {
    setFormError("");
    if (!form.name.trim() || !form.url.trim()) {
      setFormError("Nome e URL são obrigatórios.");
      return;
    }
    if (!isValidUrl(form.url.trim())) {
      setFormError("URL inválida. Use http ou https.");
      return;
    }
    if (form.intervalSec < 10 || form.timeoutMs < 100) {
      setFormError("Intervalo mínimo é 10s e timeout mínimo é 100ms.");
      return;
    }
    createMutation.mutate({
      ...form,
      name: form.name.trim(),
      url: form.url.trim(),
    });
  };

  const monitors = useMemo(() => data ?? [], [data]);
  const filteredMonitors = useMemo(() => {
    const text = query.trim().toLowerCase();
    return monitors.filter((monitor) => {
      const matchesText =
        text.length === 0 ||
        monitor.name.toLowerCase().includes(text) ||
        monitor.url.toLowerCase().includes(text);
      if (!matchesText) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "up") return monitor.lastStatus === "UP";
      if (statusFilter === "down") return monitor.lastStatus === "DOWN";
      return monitor.lastStatus === null || monitor.lastStatus === "UNKNOWN";
    });
  }, [monitors, query, statusFilter]);

  const renderStatus = (monitor: MonitorResponse) => {
    if (monitor.lastStatus === "UP") {
      return <Badge label="UP" tone="success" />;
    }
    if (monitor.lastStatus === "DOWN") {
      return <Badge label="DOWN" tone="danger" />;
    }
    return <Badge label="UNKNOWN" tone="neutral" />;
  };

  return (
    <AppLayout
      title="Monitors"
      subtitle="Gerencie endpoints monitorados e execute checks sob demanda."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["monitors"] })}
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            onClick={() => recheckAllMutation.mutate(monitors.map((monitor) => monitor.id))}
            loading={recheckAllMutation.isPending}
            disabled={monitors.length === 0}
          >
            Recheck all
          </Button>
          <Button onClick={() => setModalOpen(true)} variant="primary">
            New monitor
          </Button>
        </div>
      }
      breadcrumb="Monitors / List"
    >
      <div className="space-y-5">
        <Card title="Filtros">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou URL"
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
            <div className="flex items-center gap-2">
              {(["all", "up", "down", "unknown"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <EmptyState
            title="Não foi possível carregar os monitores"
            subtitle="Verifique a conexão com a API."
          />
        ) : monitors.length === 0 ? (
          <EmptyState
            title="Nenhum monitor configurado"
            subtitle="Crie um monitor para iniciar o acompanhamento."
          />
        ) : filteredMonitors.length === 0 ? (
          <EmptyState
            title="Nenhum monitor para os filtros aplicados"
            subtitle="Ajuste os filtros para visualizar os dados."
          />
        ) : (
          <div className="grid gap-4">
            {filteredMonitors.map((monitor) => (
              <Card key={monitor.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <Link
                      to={`/monitors/${monitor.id}`}
                      className="text-lg font-semibold hover:text-cyan-200"
                    >
                      {monitor.name}
                    </Link>
                    <div className="text-sm text-white/60">{monitor.url}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderStatus(monitor)}
                      <span className="aero-badge">Interval {monitor.intervalSec}s</span>
                      <span className="aero-badge">Timeout {monitor.timeoutMs}ms</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="text-xs text-white/50">
                      Último check: {formatDateTime(monitor.lastCheckedAt)}
                    </div>
                    <div className="text-xs text-white/50">
                      Latência: {formatLatency(monitor.lastLatencyMs)}
                    </div>
                    <div className="flex items-center gap-3">
                      <Toggle
                        checked={monitor.enabled}
                        onChange={(value) =>
                          enableMutation.mutate({ id: monitor.id, enabled: value })
                        }
                      />
                      <Button
                        variant="ghost"
                        onClick={() => recheckMutation.mutate(monitor.id)}
                        loading={recheckMutation.isPending && recheckMutation.variables === monitor.id}
                      >
                        Recheck
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} title="New monitor" onClose={() => setModalOpen(false)}>
        <div className="grid gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="API principal"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">URL</label>
            <input
              value={form.url}
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="https://api.exemplo.com/health"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">Interval (s)</label>
              <input
                type="number"
                value={form.intervalSec}
                onChange={(event) =>
                  setForm({ ...form, intervalSec: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                min={10}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">Timeout (ms)</label>
              <input
                type="number"
                value={form.timeoutMs}
                onChange={(event) =>
                  setForm({ ...form, timeoutMs: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                min={100}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Monitor ativo</div>
              <div className="text-xs text-white/60">Checks serão executados automaticamente.</div>
            </div>
            <Toggle
              checked={form.enabled ?? true}
              onChange={(value) => setForm({ ...form, enabled: value })}
            />
          </div>
          {formError ? <div className="text-sm text-rose-200">{formError}</div> : null}
          <Button onClick={handleCreate} loading={createMutation.isPending} className="w-full">
            Criar monitor
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Monitors;
