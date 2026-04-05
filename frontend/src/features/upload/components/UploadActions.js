export default function UploadActions({ loading, disabled, onUpload }) {
  return (
    <button
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-dark px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-mid focus:outline-none focus:ring-4 focus:ring-brand-mid/20 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      onClick={onUpload}
      disabled={disabled}
      aria-busy={loading}
      type="button"
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
          <span>Procesando...</span>
        </>
      ) : (
        <span>Convertir a Audio</span>
      )}
    </button>
  );
}
