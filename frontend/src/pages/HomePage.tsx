import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const shortcuts = [
  {
    title: 'Consulta de clima',
    description: 'Busque rapidamente a situacao atual de qualquer cidade e visualize o retorno normalizado da API.',
    to: '/weather',
  },
  {
    title: 'Historico',
    description: 'Acompanhe consultas salvas pelo backend, remova registros individuais e limpe a base quando precisar.',
    to: '/history',
  },
  {
    title: 'Monitoramento',
    description: 'Verifique a disponibilidade da API usando o endpoint legado atual e mantenha o frontend pronto para um futuro healthcheck.',
    to: '/monitoring',
  },
];

export function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero__grid">
          <span className="page-header__eyebrow">Dashboard</span>
          <h1>Base enxuta, profissional e pronta para integrar com a API atual.</h1>
          <p>
            Este frontend organiza a experiencia em quatro areas: visao geral, consulta de
            clima, historico operacional e monitoramento. A camada de adapters absorve as
            inconsistencias do contrato legado sem exigir reescrita do backend.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <Card title="Stack" description="React, TypeScript, Vite, Router e TanStack Query.">
          <p className="metric__value metric__value--compact">Foco total no frontend</p>
        </Card>
        <Card title="Integracao" description="Base URL por ambiente e servicos separados por dominio.">
          <p className="metric__value metric__value--compact">Adapters para legado</p>
        </Card>
        <Card title="UX" description="Loading, erro, estado vazio e feedback visual para acoes.">
          <p className="metric__value metric__value--compact">Pronto para crescer</p>
        </Card>
      </section>

      <section className="dashboard-grid">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.to} to={shortcut.to}>
            <Card
              title={shortcut.title}
              description={shortcut.description}
              interactive
            >
              <p className="muted">Abrir area</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
