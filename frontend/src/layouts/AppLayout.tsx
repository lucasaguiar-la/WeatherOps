import { NavLink, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getApiStatus } from '../services/monitoring';

const navItems = [
  { to: '/',           label: 'Início'        },
  { to: '/weather',    label: 'Consulta'      },
  { to: '/history',    label: 'Histórico'     },
  { to: '/monitoring', label: 'Monitoramento' },
];

export function AppLayout() {
  const statusQuery = useQuery({
    queryKey: ['api-status'],
    queryFn: getApiStatus,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  const isOnline = statusQuery.data?.isOnline ?? null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="brand">
            <div className="brand__mark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.5 18C4.01 18 2 15.99 2 13.5C2 11.27 3.61 9.42 5.74 9.06C6.38 6.75 8.49 5 11 5C13.97 5 16.4 7.22 16.49 10.04C18.47 10.3 20 12.01 20 14C20 16.21 18.21 18 16 18H6.5Z" fill="#5BE04A"/>
              </svg>
            </div>
            <div>
              <p className="brand__title">WeatherOps</p>
            </div>
          </div>

          <nav className="nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav__link ${isActive ? 'nav__link--active' : ''}`.trim()
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {isOnline !== null && (
            <div className={`header-status ${isOnline ? '' : 'header-status--offline'}`}>
              <span className="header-status__dot" />
              {isOnline ? 'API online' : 'API offline'}
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        WeatherOps — Lucas Aguiar · 2026
      </footer>
    </div>
  );
}
