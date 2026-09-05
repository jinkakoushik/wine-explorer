import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottleImage from '../ui/BottleImage.jsx';
import FavoriteButton from '../ui/FavoriteButton.jsx';
import { RatingBadge } from '../ui/Rating.jsx';

const TYPE_STYLES = {
  Red: 'bg-wine-950/80 text-wine-200 border-wine-700/50',
  White: 'bg-gold-950/70 text-gold-200 border-gold-600/40',
  'Rosé': 'bg-wine-900/60 text-wine-300 border-wine-500/40',
  Sparkling: 'bg-gold-900/60 text-gold-200 border-gold-500/40',
  Dessert: 'bg-ink-800/80 text-gold-300 border-gold-700/40',
  Fortified: 'bg-ink-800/80 text-ink-200 border-white/10',
};

export default function WineCard({ wine, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link
        to={`/wine/${wine._id}`}
        className="card-dark block overflow-hidden transition-all duration-300
          group-hover:border-wine-700/40 group-hover:shadow-card-hover"
      >
        {/* Bottle area */}
        <div className="relative flex h-60 items-center justify-center overflow-hidden
          bg-gradient-to-b from-ink-800/80 via-ink-900 to-ink-950 px-8 pt-6">
          <div className="absolute inset-0 bg-hero-radial opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <BottleImage
            src={wine.image}
            alt={`${wine.name} bottle`}
            className="h-full w-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Type badge */}
          <span
            className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
              TYPE_STYLES[wine.type] || TYPE_STYLES.Fortified
            }`}
          >
            {wine.type}
          </span>

          <span className="absolute right-3 top-3">
            <FavoriteButton wineId={wine._id} name={wine.name} />
          </span>
        </div>

        {/* Body */}
        <div className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-medium leading-snug text-white transition-colors group-hover:text-gold-200">
                {wine.name}
              </h3>
              <p className="mt-0.5 truncate text-xs text-ink-400">{wine.winery}</p>
            </div>
            <RatingBadge rating={wine.rating} numReviews={wine.numReviews} />
          </div>

          <p className="truncate text-xs text-ink-400">
            <span className="text-ink-300">{wine.region}</span>
            <span className="mx-1.5 text-ink-600">·</span>
            {wine.country}
          </p>

          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-[11px] uppercase tracking-wider text-ink-500">
              {wine.grape}
            </span>
            <span className="font-display text-lg font-semibold text-gold-300">
              ${Number(wine.price).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
