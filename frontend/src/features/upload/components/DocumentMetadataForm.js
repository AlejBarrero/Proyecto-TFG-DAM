export default function DocumentMetadataForm({ metadata, onChange, disabled }) {
  const inputClassName =
    'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-dark shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-mid focus:ring-4 focus:ring-brand-mid/15';

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-brand-dark">
        Titulo
        <input
          className={inputClassName}
          type="text"
          value={metadata.title}
          onChange={(e) => onChange('title', e.target.value)}
          disabled={disabled}
        />
      </label>

      <label className="block text-sm font-semibold text-brand-dark">
        Autor
        <input
          className={inputClassName}
          type="text"
          value={metadata.author}
          onChange={(e) => onChange('author', e.target.value)}
          disabled={disabled}
        />
      </label>

      <label className="block text-sm font-semibold text-brand-dark">
        Genero
        <input
          className={inputClassName}
          type="text"
          value={metadata.genre}
          onChange={(e) => onChange('genre', e.target.value)}
          disabled={disabled}
        />
      </label>

      <label className="block text-sm font-semibold text-brand-dark">
        Tipo de texto
        <input
          className={inputClassName}
          type="text"
          value={metadata.textType}
          onChange={(e) => onChange('textType', e.target.value)}
          disabled={disabled}
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-brand-dark md:col-span-2">
        <input
          type="checkbox"
          checked={metadata.isPublic}
          onChange={(e) => onChange('isPublic', e.target.checked)}
          disabled={disabled}
        />
        Marcar como publico
      </label>
    </div>
  );
}
