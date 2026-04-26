import { useState } from 'react';
import logo from '../../assets/logo-black.png';


const navButtonClassName =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-mid/20';

export default function TopNavbar({
  isAuthenticated,
  onAuthAction,
  onSignOut,
  authActionLabel = 'Acceder o registrarse',
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handlePrimaryAction = () => {
    setMenuOpen(false);

    if (isAuthenticated) {
      onSignOut?.();
      return;
    }

    onAuthAction?.();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <nav className="topbar-shell">
        <button
          className="inline-flex items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-brand-soft/80 focus:outline-none focus:ring-4 focus:ring-brand-mid/15"
          onClick={handleLogoClick}
          type="button"
        >
          <img
            src={logo}
            alt="PDF2Voice"
            className="h-10 w-auto shrink-0 sm:h-11"
          />
          <span className="block text-sm font-bold text-brand-dark sm:text-base">Inicio</span>

        </button>

        <div className="hidden items-center gap-3 md:flex">
          <button
            className={`${navButtonClassName} ${isAuthenticated
                ? 'border border-slate-200 bg-white text-brand-dark hover:bg-slate-50'
                : 'bg-brand-dark text-white hover:bg-brand-mid'
              }`}
            onClick={handlePrimaryAction}
            type="button"
          >
            {isAuthenticated ? 'Cerrar sesion' : authActionLabel}
          </button>
        </div>

        <button
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-brand-dark transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-brand-mid/15 md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
          aria-expanded={menuOpen}
          aria-label="Abrir menu"
        >
          <span className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="page-shell flex flex-col gap-3 py-4">
            <button
              className={`${navButtonClassName} ${isAuthenticated
                  ? 'border border-slate-200 bg-white text-brand-dark hover:bg-slate-50'
                  : 'bg-brand-dark text-white hover:bg-brand-mid'
                } w-full`}
              onClick={handlePrimaryAction}
              type="button"
            >
              {isAuthenticated ? 'Cerrar sesion' : authActionLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
