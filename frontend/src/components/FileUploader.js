import { useState, useRef } from "react";
import axios from "axios";
import "./FileUploader.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const MAX_SIZE_MB = 10;

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "No se seleccionó ningún archivo.";
    if (selectedFile.type !== "application/pdf")
      return "Solo se permiten archivos PDF (.pdf).";
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024)
      return `El archivo supera el límite de ${MAX_SIZE_MB} MB.`;
    return null;
  };

  const handleFileSelect = (selectedFile) => {
    setError(null);
    setResponse(null);
    const err = validateFile(selectedFile);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files[0] || null);

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo PDF antes de continuar.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await axios.post(`${API_URL}/api/pdf/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResponse(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="uploader-card">
      {!response && (
        <>
          <div
            className="drop-zone drop-zone--has-file"
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              id="pdf-input"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInputChange}
              className="visually-hidden"
            />
            {file ? (
              <div className="file-info" aria-live="polite">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ) : (
              <div className="drop-prompt">
                <p className="drop-text">
                  Hace click para buscarlo
                </p>
                <p className="drop-hint">
                  Solo PDF &bull; Máximo {MAX_SIZE_MB} MB
                </p>
              </div>
            )}
          </div>
          <button
            className="btn btn--primary"
            onClick={handleUpload}
            disabled={loading || !file}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>Convertir a Audio</span>
              </>
            )}
          </button>
        </>
      )}
      {error && (
        <div className="alert alert--error" role="alert" aria-live="assertive">
          <span>{error}</span>
        </div>
      )}
      {response && (
        <div className="result" aria-live="polite">
          <div className="result__header">
            <h2 className="result__title">Conversión completada</h2>
          </div>
          <div className="result__badges">
            <span
              className="badge badge--lang"
            >Idioma detectado: 
              {response.detectedLanguage}
            </span>
            {response.translated && (
              <span
                className="badge badge--translated"
              >
                Traducido de inles a español
              </span>
            )}
          </div>
          <div className="result__audio">
            <h3 className="result__audio-title">Reproducir audio</h3>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              controls
              src={response.audioUrl}
              className="audio-player"
            />
          </div>
          <div className="result__actions">
            <a
              className="btn btn--success"
              href={response.audioUrl}
              download="pdf2voice-audio.mp3"
            >
              <span>Descargar MP3</span>
            </a>
            <button
              className="btn btn--secondary"
              onClick={handleReset}
            >
              <span>Convertir otro PDF</span>
            </button>
            <button
              className="btn btn--secondary"
              onClick={handleReset}
            >
              <span>Administrar audios</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
