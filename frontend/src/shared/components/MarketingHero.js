export default function MarketingHero({ eyebrow = 'PDF2Voice', title, description }) {
  return (
    <section className="hero-shell">
      <div className="hero-card">
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {title || 'Convierte documentos PDF en audio con una experiencia dual.'}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            {description ||
              'Los invitados pueden convertir temporalmente. Los usuarios autenticados guardan sus documentos, y los administradores acceden a una vista de control global.'}
          </p>
        </div>
      </div>
    </section>
  );
}
