import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiStatusCard } from '../components/monitoring/ApiStatusCard';
import { getApiStatus } from '../services/monitoring';

const REFRESH_INTERVAL = 30_000;

export function MonitoringPage() {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

  const statusQuery = useQuery({
    queryKey: ['api-status'],
    queryFn: getApiStatus,
    refetchInterval: REFRESH_INTERVAL,
  });

  useEffect(() => {
    setCountdown(REFRESH_INTERVAL / 1000);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return REFRESH_INTERVAL / 1000;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [statusQuery.dataUpdatedAt]);

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Monitoramento</span>
        <h1>Status do serviço</h1>
        <p>Disponibilidade do serviço verificado automaticamente a cada 30 segundos.</p>
      </header>

      <ApiStatusCard
        isLoading={statusQuery.isLoading}
        onRefresh={() => statusQuery.refetch()}
        status={statusQuery.data}
        countdown={countdown}
      />
    </div>
  );
}
