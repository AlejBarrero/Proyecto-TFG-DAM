import { useTranslation } from 'react-i18next';

export default function HomeHero({
  user,
  isAuthenticated,
  showAuthPanel,
  onToggleAuthPanel,
  onSignOut,
}) {
  const { t } = useTranslation();

  return (
    <header className="bg-brand-hero px-6 py-10 text-white shadow-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {t('homeHero.title')}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            {t('homeHero.description')}
          </p>
          <p className="max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            {t('homeHero.guestInfo')}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {t('homeHero.cta')}
          </p>
        </div>
      </div>
    </header>
  );
}
