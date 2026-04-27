import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/weather', label: 'Consulta' },
  { to: '/history', label: 'Historico' },
  { to: '/monitoring', label: 'Monitoramento' },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="brand">
            <div className="brand__mark">wOps</div>
            <div>
              <p className="brand__title">WeatherOps</p>
            </div>
          </div>

          <nav className="nav" aria-label="Navegacao principal">
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
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        Desenvolvido por Lucas Aguiar - 2026
      </footer>
    </div>
  );
}
