export default function UploadError({ message }) {
  if (!message) return null;

  return (
    <div
      className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm text-brand-accent"
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
    </div>
  );
}
