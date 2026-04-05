import { useState } from 'react';

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
    <div className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="inline-flex items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-brand-soft/80"
          onClick={handleLogoClick}
          type="button"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-sm font-black text-white">
            P2V
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-brand-mid">
              PDF2Voice
            </span>
            <span className="block text-base font-bold text-brand-dark">Inicio</span>
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <button
            className={`${navButtonClassName} ${
              isAuthenticated
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-brand-dark transition hover:bg-slate-50 md:hidden"
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
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-panel md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <button
              className={`${navButtonClassName} ${
                isAuthenticated
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
