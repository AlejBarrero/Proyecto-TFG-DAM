export default function UploadDropZone({ file, inputRef, onInputChange, maxSizeMb }) {
  return (
    <div
      className="drop-zone drop-zone--has-file"
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        id="pdf-input"
        type="file"
        accept="application/pdf,.pdf"
        onChange={onInputChange}
        className="visually-hidden"
      />

      {file ? (
        <div className="file-info" aria-live="polite">
          <span className="file-name">{file.name}</span>
          <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      ) : (
        <div className="drop-prompt">
          <p className="drop-text">Hace click para buscarlo</p>
          <p className="drop-hint">Solo PDF • Máximo {maxSizeMb} MB</p>
        </div>
      )}
    </div>
  );
}
