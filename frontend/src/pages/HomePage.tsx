import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHistory } from '../services/history';

const shortcuts = [
  {
    icon: '🔍',
    label: 'Consulta',
    title: 'Clima em tempo real',
    description: 'Digite qualquer cidade do mundo e veja temperatura e condições atuais em segundos.',
    to: '/weather',
  },
  {
    icon: '📋',
    label: 'Histórico',
    title: 'Consultas anteriores',
    description: 'Acompanhe todas as buscas realizadas, com data, cidade e temperatura registradas.',
    to: '/history',
  },
  {
    icon: '📡',
    label: 'Monitoramento',
    title: 'Status da API',
    description: 'Veja se o serviço está disponível e acompanhe a disponibilidade em tempo real.',
    to: '/monitoring',
  },
];

export function HomePage() {
  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: getHistory,
    staleTime: 60_000,
  });

  const totalConsultas = historyQuery.data?.length ?? '—';
  const cidades = historyQuery.data
    ? new Set(historyQuery.data.map((r) => r.city)).size
    : '—';

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__grid">
          <h1>Dados climáticos<br />onde você precisar</h1>
          <p>
            Consulte temperatura e condições de qualquer localidade,
            acompanhe o histórico e monitore a saúde do serviço — tudo em um só lugar.
          </p>
          <div className="hero__cta">
            <Link to="/weather" className="btn btn--primary">
              Fazer consulta
            </Link>
            <Link to="/history" className="btn btn--nav">
              Ver histórico
            </Link>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stats-bar__item">
          <span className="stats-bar__label">Consultas registradas</span>
          <span className="stats-bar__value">{totalConsultas}</span>
        </div>
        <div className="stats-bar__item">
          <span className="stats-bar__label">Cidades pesquisadas</span>
          <span className="stats-bar__value">{cidades}</span>
        </div>
        <div className="stats-bar__item">
          <span className="stats-bar__label">Atualização</span>
          <span className="stats-bar__value stats-bar__value--green">Tempo real</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.to} to={shortcut.to}>
            <div className="card card--interactive">
              <div className="shortcut-card">
                <div className="shortcut-card__icon">{shortcut.icon}</div>
                <div>
                  <span className="shortcut-card__label">{shortcut.label}</span>
                  <h3 className="shortcut-card__title">{shortcut.title}</h3>
                </div>
                <p className="shortcut-card__desc">{shortcut.description}</p>
                <span className="shortcut-card__arrow">Acessar →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
