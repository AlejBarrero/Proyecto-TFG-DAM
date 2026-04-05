export default function AudioBadges({ detectedLanguage, translated }) {
  return (
    <div className="flex flex-wrap gap-3">
      <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark">
        Idioma: {detectedLanguage}
      </span>
      {translated && (
        <span className="inline-flex items-center rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Traducido a español
        </span>
      )}
    </div>
  );
}
