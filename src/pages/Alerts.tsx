import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { alertsApi } from "../api/endpoints";
import { formatDateTime } from "../utils/format";
import PageSection from "../components/PageSection";

const Alerts = () => {
  const [filter, setFilter] = useState<"unacked" | "all">("unacked");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["alerts", filter],
    queryFn: () => alertsApi.list(filter),
  });

  const ackMutation = useMutation({
    mutationFn: (alertId: string) => alertsApi.ack(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
  });

  const alerts = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      const aUnacked = a.status === "UNACKED";
      const bUnacked = b.status === "UNACKED";
      if (aUnacked !== bUnacked) return aUnacked ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted;
  }, [data]);

  return (
    <AppLayout
      title="Alerts"
      subtitle="Acompanhe incidentes recentes e reconheça alertas."
      breadcrumb="Alerts / List"
    >
      <div className="space-y-5">
        <Card title="Filtros">
          <div className="flex gap-2">
            {(["unacked", "all"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filter === status
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {status === "unacked" ? "Unacked" : "All"}
              </button>
            ))}
          </div>
        </Card>

        <PageSection title="Resultados" description="Lista ordenada por prioridade e recência">
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <EmptyState
              title="Erro ao carregar alertas"
              subtitle="Confirme se a API está disponível."
            />
          ) : alerts.length === 0 ? (
            <EmptyState title="Sem alertas" subtitle="Tudo sob controle por aqui." />
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-sm text-white/50">Monitor {alert.monitorId}</div>
                      <div className="text-lg font-semibold">{alert.event}</div>
                      <div className="text-xs text-white/50">
                        {formatDateTime(alert.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        label={alert.status}
                        tone={alert.status === "UNACKED" ? "warning" : "neutral"}
                      />
                      {alert.status === "UNACKED" ? (
                        <Button
                          variant="ghost"
                          onClick={() => ackMutation.mutate(alert.id)}
                          loading={ackMutation.isPending && ackMutation.variables === alert.id}
                        >
                          Ack
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </PageSection>
      </div>
    </AppLayout>
  );
};

export default Alerts;
