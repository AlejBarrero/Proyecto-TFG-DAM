export default function UserDocumentsHeader({ user, onSignOut }) {
  return (
    <header className="bg-brand-hero px-6 py-10 text-white shadow-panel">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
            Usuario
          </p>
          <h1 className="text-4xl font-black tracking-tight">Tus documentos</h1>
        </div>

        <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
          <p className="text-sm text-white/80">{user.userName}</p>
          <p className="mt-1 text-sm text-white/70">Rol: {user.role}</p>
          <button
            className="mt-4 rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={onSignOut}
            type="button"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </header>
  );
}
