import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '🍷', title, message, ctaTo, ctaLabel }) {
  return (
    <div className="card-dark mx-auto flex max-w-lg flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-800 text-3xl">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-white">{title}</h3>
      {message && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-400">{message}</p>}
      {ctaTo && ctaLabel && (
        <Link to={ctaTo} className="btn-primary mt-7">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
