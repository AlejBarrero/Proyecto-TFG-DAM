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
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Convierte documentos PDF en audio con una experiencia dual.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            Los invitados pueden convertir temporalmente.
            Los usuarios autenticados guardan sus documentos.
          </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Puedes entrar con tu cuenta o seguir como invitado para una conversión temporal.
            </p>
        </div>

      </div>

    </header>
  );
}
