export default function UploadActions({ loading, disabled, onUpload }) {
  return (
    <button className="btn btn--primary" onClick={onUpload} disabled={disabled} aria-busy={loading}>
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>Procesando...</span>
        </>
      ) : (
        <span>Convertir a Audio</span>
      )}
    </button>
  );
}
