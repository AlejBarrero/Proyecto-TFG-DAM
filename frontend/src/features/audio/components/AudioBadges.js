export default function AudioBadges({ detectedLanguage, translated }) {
  return (
    <div className="result__badges">
      <span className="badge badge--lang">
        Idioma detectado:
        {detectedLanguage}
      </span>
      {translated && <span className="badge badge--translated">Traducido de ingles a español</span>}
    </div>
  );
}
