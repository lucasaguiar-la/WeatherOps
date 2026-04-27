import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { ApiStatus } from '../../types/domain';

type ApiStatusCardProps = {
  isLoading: boolean;
  onRefresh: () => void;
  status?: ApiStatus;
};

export function ApiStatusCard({ isLoading, onRefresh, status }: ApiStatusCardProps) {
  const isOnline = Boolean(status?.isOnline);

  return (
    <Card
      title="Status da API"
      description="Indicador simples para saber se o backend está respondendo."
    >
      <div className="stack">
        <div className="cluster">
          <StatusBadge
            label={isLoading && !status ? 'Verificando...' : isOnline ? 'Online' : 'Offline'}
            tone={isLoading && !status ? 'neutral' : isOnline ? 'online' : 'offline'}
          />
          <Button isLoading={isLoading} onClick={onRefresh} variant="secondary">
            Atualizar agora
          </Button>
        </div>

        <div className="inline-list">
          <div className="inline-list__item">
            <span>Mensagem</span>
            <strong>{status?.message ?? 'Aguardando primeira verificação...'}</strong>
          </div>
          <div className="inline-list__item">
            <span>Ultima tentativa</span>
            <strong>{status?.checkedAt ?? 'Ainda não executada'}</strong>
          </div>
          <div className="inline-list__item">
            <span>Origem</span>
            <strong>{status?.source ?? 'root'}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}
