const inputClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-dark shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/15';

export default function UserDocumentEditor({
  selectedDocument,
  editableDocument,
  audioUrl,
  loadingDetail,
  saving,
  error,
  onFieldChange,
  onSave,
  onDelete,
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-panel">
      <h2 className="text-xl font-bold">Detalle y edicion</h2>

      {error && (
        <p className="mt-4 rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent">
          {error}
        </p>
      )}

      {loadingDetail && <p className="mt-4 text-sm text-slate-500">Cargando detalle...</p>}

      {!loadingDetail && !selectedDocument && (
        <p className="mt-4 text-sm text-slate-500">
          Selecciona un documento del listado para ver su detalle.
        </p>
      )}

      {selectedDocument && (
        <div className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-brand-dark md:col-span-2">
              Titulo
              <input
                className={inputClassName}
                value={editableDocument.title}
                onChange={(e) => onFieldChange('title', e.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-dark">
              Autor
              <input
                className={inputClassName}
                value={editableDocument.author}
                onChange={(e) => onFieldChange('author', e.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-dark">
              Genero
              <input
                className={inputClassName}
                value={editableDocument.genre}
                onChange={(e) => onFieldChange('genre', e.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-dark">
              Tipo de texto
              <input
                className={inputClassName}
                value={editableDocument.textType}
                onChange={(e) => onFieldChange('textType', e.target.value)}
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-mid">Idioma</p>
              <p className="mt-2 text-sm">{selectedDocument.languageCode}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <label className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
                <input
                  type="checkbox"
                  checked={editableDocument.isPublic}
                  onChange={(e) => onFieldChange('isPublic', e.target.checked)}
                />
                Marcar como publico
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-mid">Archivo original</p>
              <p className="mt-2 text-sm">{selectedDocument.fileName}</p>
            </div>
          </div>

          {audioUrl && (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-mid">
                Audio
              </h3>
              <audio controls src={audioUrl} className="w-full rounded-xl" />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl bg-brand-dark px-5 py-3 text-sm font-semibold text-white"
              onClick={onSave}
              disabled={saving}
              type="button"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              className="rounded-2xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-600"
              onClick={onDelete}
              type="button"
            >
              Borrar documento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
