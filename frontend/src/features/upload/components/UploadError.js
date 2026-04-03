export default function UploadError({ message }) {
  if (!message) return null;

  return (
    <div className="alert alert--error" role="alert" aria-live="assertive">
      <span>{message}</span>
    </div>
  );
}
