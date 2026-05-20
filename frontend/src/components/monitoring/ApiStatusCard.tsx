import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { ApiStatus } from '../../types/domain';

type ApiStatusCardProps = {
  isLoading: boolean;
  onRefresh: () => void;
  status?: ApiStatus;
  countdown?: number;
};

const MOCK_BARS = Array.from({ length: 24 }, (_, i) => {
  if (i === 20) return 'warn';
  if (i === 21) return 'off';
  return 'ok';
}) as Array<'ok' | 'warn' | 'off'>;

export function ApiStatusCard({ isLoading, onRefresh, status, countdown }: ApiStatusCardProps) {
  const isOnline = Boolean(status?.isOnline);
  const badgeLabel = isLoading && !status ? 'Verificando...' : isOnline ? 'Online' : 'Offline';
  const badgeTone = isLoading && !status ? 'neutral' : isOnline ? 'online' : 'offline';

  return (
    <Card title="Status da API">
      <div className="stack">
        <div className="cluster">
          <StatusBadge label={badgeLabel} tone={badgeTone} />
          <Button isLoading={isLoading} onClick={onRefresh} variant="secondary">
            Atualizar
          </Button>
          {countdown !== undefined && (
            <span className="countdown-ring">
              Próxima verificação em {countdown}s
            </span>
          )}
        </div>

        <div className="inline-list">
          <div className="inline-list__item">
            <span>Mensagem</span>
            <strong>{status?.message ?? 'Aguardando verificação...'}</strong>
          </div>
          <div className="inline-list__item">
            <span>Última checagem</span>
            <strong>{status?.checkedAt ?? '—'}</strong>
          </div>
        </div>

        <div>
          <p className="muted" style={{ marginBottom: '0.6rem' }}>Disponibilidade nas últimas 24h</p>
          <div className="uptime-timeline">
            {MOCK_BARS.map((state, i) => (
              <div
                key={i}
                className={`uptime-bar uptime-bar--${state}`}
                style={{ height: state === 'ok' ? '100%' : state === 'warn' ? '60%' : '30%' }}
                title={state === 'ok' ? 'Disponível' : state === 'warn' ? 'Instável' : 'Indisponível'}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
