export default function AudioPlayer({ audioUrl }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-mid">
        Reproducir audio
      </h3>
      <audio controls src={audioUrl} className="w-full rounded-xl" />
    </div>
  );
}
