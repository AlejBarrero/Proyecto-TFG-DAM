export default function AudioActions({ audioUrl, onReset }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand-accent/20"
        href={audioUrl}
        download="pdf2voice-audio.mp3"
      >
        <span>Descargar MP3</span>
      </a>
      <button
        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-brand-mid/30 bg-white px-5 py-3 text-sm font-semibold text-brand-mid transition hover:bg-brand-soft focus:outline-none focus:ring-4 focus:ring-brand-mid/20"
        onClick={onReset}
        type="button"
      >
        <span>Convertir otro PDF</span>
      </button>
    </div>
  );
}
