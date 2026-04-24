import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
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
            <div className="brand__mark">WC</div>
            <div>
              <p className="brand__title">Weather Control</p>
              <p className="brand__subtitle">Frontend React para a API legado de clima.</p>
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
        Painel pronto para crescer sem alterar o backend legado.
      </footer>
    </div>
  );
}
