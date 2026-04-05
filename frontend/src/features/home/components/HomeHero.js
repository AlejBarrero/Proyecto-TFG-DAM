export default function HomeHero({
  user,
  isAuthenticated,
  showAuthPanel,
  onToggleAuthPanel,
  onSignOut,
}) {
  return (
    <header className="bg-brand-hero px-6 py-10 text-white shadow-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
            PDF2Voice
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Convierte documentos PDF en audio con una experiencia dual.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Los invitados pueden convertir temporalmente. Los usuarios autenticados guardan sus
            documentos, y los administradores acceden a una vista de control global.
          </p>
        </div>

        <div className="max-w-md rounded-[30px] border border-white/15 bg-white/10 p-6 backdrop-blur">
          {isAuthenticated && user ? (
            <>
              <p className="text-sm text-white/75">Sesión activa</p>
              <p className="mt-2 text-2xl font-bold">{user.userName}</p>
              <p className="mt-1 text-sm text-white/70">Rol: {user.role}</p>
              <button
                className="mt-5 inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={onSignOut}
                type="button"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-white/75">Modo de acceso</p>
              <p className="mt-2 text-xl font-bold">Invitado, usuario o administrador</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Puedes entrar con tu cuenta o seguir como invitado para una conversión temporal.
              </p>
              <button
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-soft"
                onClick={onToggleAuthPanel}
                type="button"
              >
                {showAuthPanel ? 'Ocultar acceso' : 'Acceder o registrarse'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
