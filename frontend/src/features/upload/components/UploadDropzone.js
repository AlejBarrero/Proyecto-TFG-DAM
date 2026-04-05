import { formatFileSize } from '../../../shared/utils/formatFileSize';

export default function UploadDropZone({ file, inputRef, onInputChange, maxSizeMb }) {
  const containerClassName = [
    'group rounded-[24px] border-2 border-dashed px-5 py-8 text-center transition sm:rounded-[28px] sm:px-6 sm:py-10',
    'cursor-pointer bg-slate-50 hover:border-brand-dark hover:bg-white',
    'focus:outline-none focus:ring-4 focus:ring-brand-mid/20',
    file ? 'border-brand-mid bg-white' : 'border-brand-mid/60',
  ].join(' ');

  return (
    <div
      className={containerClassName}
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
        className="sr-only"
      />

      {file ? (
        <div className="flex flex-col items-center gap-3" aria-live="polite">
          <span className="text-3xl sm:text-4xl" aria-hidden="true">
            PDF
          </span>
          <span className="max-w-full break-all text-sm font-semibold text-brand-dark sm:text-base">
            {file.name}
          </span>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-mid">
            {formatFileSize(file.size)}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl text-brand-mid transition group-hover:scale-105 sm:text-5xl">
            +
          </span>
          <p className="m-0 text-base font-semibold text-brand-dark sm:text-lg">
            Haz clic para buscar tu PDF
          </p>
          <p className="m-0 text-sm text-slate-500">Solo PDF • Máximo {maxSizeMb} MB</p>
        </div>
      )}
    </div>
  );
}
