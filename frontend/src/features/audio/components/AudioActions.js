export default function AudioActions({ audioUrl, onReset }) {
  return (
    <div className="result__actions">
      <a className="btn btn--success" href={audioUrl} download="pdf2voice-audio.mp3">
        <span>Descargar MP3</span>
      </a>
      <button className="btn btn--secondary" onClick={onReset}>
        <span>Convertir otro PDF</span>
      </button>
      {/* <button className="btn btn--secondary" onClick={onReset}>
        <span>Administrar audios</span>
      </button> */}
    </div>
  );
}
