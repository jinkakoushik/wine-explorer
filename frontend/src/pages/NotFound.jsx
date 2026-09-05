import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <EmptyState
        icon="🍷"
        title="This bottle seems to be missing"
        message="The page you're looking for doesn't exist or may have been moved."
        ctaTo="/"
        ctaLabel="Back to the cellar"
      />
      <p className="sr-only">Error 404 — page not found</p>
      <Link to="/explore" className="hidden">Explore wines</Link>
    </div>
  );
}
