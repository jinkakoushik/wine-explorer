const SIZES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export default function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6" role="status" aria-live="polite">
      <div
        className={`animate-spin-slow rounded-full border-ink-700 border-t-wine-500 ${SIZES[size]}`}
      />
      {label && <p className="text-xs tracking-wide text-ink-400">{label}</p>}
    </div>
  );
}
