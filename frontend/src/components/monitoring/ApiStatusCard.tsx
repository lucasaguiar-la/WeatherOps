import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import type { ApiStatus, AvailabilityBar, MonitoringAvailability } from '../../types/domain';

type ApiStatusCardProps = {
  isLoading: boolean;
  onRefresh: () => void;
  status?: ApiStatus;
  countdown?: number;
  availability?: MonitoringAvailability;
};

const SKELETON_BARS: AvailabilityBar[] = Array.from({ length: 24 }, () => ({
  hour: '',
  status: 'ok' as const,
  uptimePct: null,
  avgResponseMs: null,
}));

function buildBarTooltip(bar: AvailabilityBar): string {
  const label =
    bar.status === 'ok'
      ? 'Disponivel'
      : bar.status === 'warn'
        ? 'Instavel'
        : 'Indisponivel';
  const hour = bar.hour
    ? new Date(bar.hour).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '';
  const ms = bar.avgResponseMs != null ? ` - ${bar.avgResponseMs}ms` : '';
  const pct = bar.uptimePct != null ? ` (${bar.uptimePct}%)` : '';
  return `${hour} ${label}${ms}${pct}`.trim();
}

export function ApiStatusCard({
  isLoading,
  onRefresh,
  status,
  countdown,
  availability,
}: ApiStatusCardProps) {
  const isOnline = Boolean(status?.isOnline);
  const badgeLabel = isLoading && !status ? 'Verificando...' : isOnline ? 'Online' : 'Offline';
  const badgeTone = isLoading && !status ? 'neutral' : isOnline ? 'online' : 'offline';

  const bars = availability?.bars ?? SKELETON_BARS;

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
            {bars.map((bar, i) => (
              <div
                key={i}
                className={`uptime-bar uptime-bar--${bar.status}`}
                style={{
                  height: bar.status === 'ok' ? '100%' : bar.status === 'warn' ? '60%' : '30%',
                  opacity: availability ? 1 : 0.35,
                }}
                title={buildBarTooltip(bar)}
              />
            ))}
          </div>
        </div>

        {availability && (
          <div className="stats-grid">
            <div className="metric">
              <span className="metric__label">Uptime 24h</span>
              <span className="metric__value metric__value--compact">
                {availability.uptimePct24h != null ? `${availability.uptimePct24h}%` : '--'}
              </span>
            </div>
            <div className="metric">
              <span className="metric__label">Tempo médio</span>
              <span className="metric__value metric__value--compact">
                {availability.avgResponseMs24h != null ? `${availability.avgResponseMs24h}ms` : '--'}
              </span>
            </div>
            <div className="metric">
              <span className="metric__label">Total de checagens</span>
              <span className="metric__value metric__value--compact">
                {availability.totalChecks24h}
              </span>
            </div>
            <div className="metric">
              <span className="metric__label">Último incidente</span>
              <span className="metric__value metric__value--compact">
                {availability.lastIncidentAt
                  ? new Date(availability.lastIncidentAt).toLocaleString('pt-BR')
                  : 'Nenhum'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
