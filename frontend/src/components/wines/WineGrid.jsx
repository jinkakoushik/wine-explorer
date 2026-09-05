import WineCard from './WineCard.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

function SkeletonCard() {
  return (
    <div className="card-dark overflow-hidden">
      <div className="skeleton h-60 rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-2/3" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive wine grid: 1 / 2 / 3 / 4 columns by breakpoint.
 */
export default function WineGrid({ wines, loading, error, onRetry, emptyProps = {} }) {
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <LoadingSpinner label="Pouring wines…" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!wines || wines.length === 0) {
    return <EmptyState icon="🍇" title="No wines found" {...emptyProps} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wines.map((wine, i) => (
        <WineCard key={wine._id} wine={wine} index={i} />
      ))}
    </div>
  );
}
