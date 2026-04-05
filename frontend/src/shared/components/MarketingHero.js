export default function MarketingHero({ eyebrow = 'PDF2Voice', title, description }) {
  return (
    <section className="px-4 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-7xl rounded-[34px] bg-brand-hero px-6 py-10 text-white shadow-panel sm:px-10 sm:py-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {title || 'Convierte documentos PDF en audio con una experiencia dual.'}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            {description ||
              'Los invitados pueden convertir temporalmente. Los usuarios autenticados guardan sus documentos, y los administradores acceden a una vista de control global.'}
          </p>
        </div>
      </div>
    </section>
  );
}
