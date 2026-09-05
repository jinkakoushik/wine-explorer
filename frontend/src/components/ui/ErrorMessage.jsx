export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card-dark mx-auto flex max-w-lg flex-col items-center border-wine-800/40 px-8 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-wine-950/60 text-2xl">
        ⚠️
        </div>
      <h3 className="font-display text-xl text-white">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-6">
          Try again
        </button>
      )}
    </div>
  );
}
