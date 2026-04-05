import AudioBadges from './AudioBadges';
import AudioPlayer from './AudioPlayer';
import AudioActions from './AudioActions';

export default function AudioResultCard({ response, onReset }) {
  return (
    <div
      className="w-full max-w-3xl rounded-[28px] border border-white/60 bg-white/95 p-8 shadow-panel backdrop-blur sm:p-10"
      aria-live="polite"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-mid">
            Resultado
          </p>
          <h2 className="text-3xl font-black tracking-tight text-brand-dark">
            {response.title || response.fileName}
          </h2>
          <p className="text-sm text-slate-500">Conversión completada correctamente.</p>
        </div>
      </div>

      <AudioBadges
        detectedLanguage={response.languageCode}
        translated={Boolean(response.translated || response.translatedText)}
      />

      <div className="mt-6">
        <AudioPlayer audioUrl={response.audioUrl} />
      </div>

      <div className="mt-6">
        <AudioActions audioUrl={response.audioUrl} onReset={onReset} />
      </div>
    </div>
  );
}
