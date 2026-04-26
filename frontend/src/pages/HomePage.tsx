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
          <h1>Seus dados de clima em um só lugar.</h1>
          <p>
            Este frontend organiza a experiencia em quatro areas: visao geral, consulta de
            clima, historico operacional e monitoramento.
          </p>
        </div>
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
