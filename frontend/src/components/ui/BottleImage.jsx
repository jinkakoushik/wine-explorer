import { useState } from 'react';

/**
 * Image with an elegant loading transition: shimmer placeholder until
 * the image decodes, then a fade-in. Falls back to a bottle emoji tile
 * if the image fails to load.
 */
export default function BottleImage({ src, alt, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !failed && <div className="skeleton absolute inset-0" />}
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-ink-800/60 text-4xl">
          🍷
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
