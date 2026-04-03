export default function AudioPlayer({ audioUrl }) {
  return (
    <div className="result__audio">
      <h3 className="result__audio-title">Reproducir audio</h3>
      <audio controls src={audioUrl} className="audio-player" />
    </div>
  );
}
