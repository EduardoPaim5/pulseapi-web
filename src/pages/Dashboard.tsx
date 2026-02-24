import { useQuery } from "@tanstack/react-query";
import AppLayout from "../layouts/AppLayout";
import Card from "../components/Card";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import PageSection from "../components/PageSection";
import { dashboardApi } from "../api/endpoints";
import { formatDateTime, formatNumber, formatPercent } from "../utils/format";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => dashboardApi.overview("7d"),
  });

  if (isLoading) {
    return (
      <AppLayout title="Dashboard" subtitle="Visão geral dos últimos 7 dias">
        <Spinner />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout title="Dashboard" subtitle="Visão geral dos últimos 7 dias">
        <EmptyState
          title="Não foi possível carregar o dashboard"
          subtitle="Verifique a conexão com a API e tente novamente."
        />
      </AppLayout>
    );
  }

  const { totals, latestAlerts, worstMonitors } = data;

  return (
    <AppLayout title="Dashboard" subtitle="Visão geral dos últimos 7 dias">
      <div className="space-y-6">
        <PageSection title="Resumo" description="Indicadores consolidados do ambiente">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card title="Monitors">
              <div className="text-2xl font-semibold">{formatNumber(totals.monitorsTotal)}</div>
              <div className="text-xs text-white/60 mt-1">Total configurado</div>
            </Card>
            <Card title="Up">
              <div className="text-2xl font-semibold text-emerald-200">
                {formatNumber(totals.monitorsUp)}
              </div>
              <div className="text-xs text-white/60 mt-1">Disponíveis</div>
            </Card>
            <Card title="Down">
              <div className="text-2xl font-semibold text-rose-200">
                {formatNumber(totals.monitorsDown)}
              </div>
              <div className="text-xs text-white/60 mt-1">Indisponíveis</div>
            </Card>
            <Card title="Incidents">
              <div className="text-2xl font-semibold text-amber-200">
                {formatNumber(totals.incidentsOpen)}
              </div>
              <div className="text-xs text-white/60 mt-1">Abertos</div>
            </Card>
          </div>
        </PageSection>

        <div className="grid gap-6 xl:grid-cols-2">
          <PageSection title="Monitores recentes" description="Monitores priorizados para acompanhamento">
            <Card title="Worst monitors">
              {worstMonitors.length === 0 ? (
                <div className="text-sm text-white/60">Nenhum dado suficiente ainda.</div>
              ) : (
                <div className="space-y-3">
                  {worstMonitors.map((monitor) => (
                    <div
                      key={monitor.monitorId}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold">{monitor.name}</div>
                        <div className="text-xs text-white/50">
                          {formatNumber(monitor.totalChecks)} checks
                        </div>
                      </div>
                      <Badge label={formatPercent(monitor.uptimePercent)} tone="danger" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </PageSection>

          <PageSection title="Incidentes/Alertas" description="Últimos eventos do sistema">
            <Card title="Latest alerts">
              {latestAlerts.length === 0 ? (
                <div className="text-sm text-white/60">Nenhum alerta nas últimas execuções.</div>
              ) : (
                <div className="space-y-3">
                  {latestAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-semibold">{alert.event}</div>
                        <div className="text-xs text-white/50">{formatDateTime(alert.createdAt)}</div>
                      </div>
                      <Badge
                        label={alert.status === "UNACKED" ? "UNACKED" : "ACKED"}
                        tone={alert.status === "UNACKED" ? "warning" : "neutral"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </PageSection>

          <PageSection title="Métricas" description="Relação geral de disponibilidade e incidentes">
            <Card title="Health ratio">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-white/50">Up / Total</div>
                  <div className="text-lg font-semibold">
                    {formatNumber(totals.monitorsUp)} / {formatNumber(totals.monitorsTotal)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-xs text-white/50">Incidents Open</div>
                  <div className="text-lg font-semibold">{formatNumber(totals.incidentsOpen)}</div>
                </div>
              </div>
            </Card>
          </PageSection>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
