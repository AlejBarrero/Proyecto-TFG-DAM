export default function UserDocumentsList({
  documents,
  loading,
  selectedDocumentId,
  onSelectDocument,
}) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-panel">
      <h2 className="text-xl font-bold">Listado</h2>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Cargando documentos...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {documents.map((item) => {
            const isSelected = item.id === selectedDocumentId;

            return (
              <button
                key={item.id}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-brand-dark bg-brand-soft/60'
                    : 'border-slate-200 hover:border-brand-mid hover:bg-slate-50'
                }`}
                onClick={() => onSelectDocument(item.id)}
                type="button"
              >
                <p className="font-semibold text-brand-dark">{item.title || item.fileName}</p>
                <p className="text-xs text-slate-500">{item.fileName}</p>
                <p className="mt-2 text-xs text-slate-500">Idioma: {item.languageCode}</p>
              </button>
            );
          })}

          {!documents.length && (
            <p className="text-sm text-slate-500">Todavia no tienes documentos guardados.</p>
          )}
        </div>
      )}
    </div>
  );
}
