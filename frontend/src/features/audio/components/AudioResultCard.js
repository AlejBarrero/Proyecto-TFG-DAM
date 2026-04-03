import AudioBadges from './AudioBadges';
import AudioPlayer from './AudioPlayer';
import AudioActions from './AudioActions';

export default function AudioResultCard({ response, onReset }) {
  return (
    <div className="result" aria-live="polite">
      <div className="result__header">
        <h2 className="result__title">Conversión completada</h2>
      </div>

      <AudioBadges detectedLanguage={response.detectedLanguage} translated={response.translated} />

      <AudioPlayer audioUrl={response.audioUrl} />

      <AudioActions audioUrl={response.audioUrl} onReset={onReset} />
    </div>
  );
}
