import { useQuery } from '@tanstack/react-query';
import { ApiStatusCard } from '../components/monitoring/ApiStatusCard';
import { Card } from '../components/ui/Card';
import { getApiStatus } from '../services/monitoring';

export function MonitoringPage() {
  const statusQuery = useQuery({
    queryKey: ['api-status'],
    queryFn: getApiStatus,
    refetchInterval: 30_000,
  });

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Monitoramento</span>
        <h1>Disponibilidade da API em tempo real</h1>
      </header>

      <div className="panel-grid">
        <ApiStatusCard
          isLoading={statusQuery.isLoading}
          onRefresh={() => statusQuery.refetch()}
          status={statusQuery.data}
        />

        <Card
          title="Leitura operacional"
          description="Visão resumida."
        >
          <div className="inline-list">
            <div className="inline-list__item">
              <span>Endpoint atual</span>
              <strong className="mono">GET /</strong>
            </div>
            <div className="inline-list__item">
              <span>Atualização automática</span>
              <strong>A cada 30 segundos</strong>
            </div>
            <div className="inline-list__item">
              <span>Pronto para</span>
              <strong className="mono">/health</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
