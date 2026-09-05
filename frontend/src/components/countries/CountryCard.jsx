import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RatingBadge } from '../ui/Rating.jsx';

export default function CountryCard({ country, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.35), ease: 'easeOut' }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/countries/${encodeURIComponent(country.name)}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-ink-900/70 shadow-card transition-all duration-300 hover:border-gold-500/40 hover:shadow-card-hover"
      >
        {/* Background bottle image, dimmed */}
        {country.image && (
          <div className="absolute inset-0 opacity-[0.13] transition-opacity duration-500 group-hover:opacity-25">
            <img src={country.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />

        <div className="relative flex h-40 flex-col justify-end p-5">
          <h3 className="font-display text-2xl text-white transition-colors group-hover:text-gold-200">
            {country.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-xs text-ink-300">
              {country.count} {country.count === 1 ? 'wine' : 'wines'}
            </span>
            {country.avgRating > 0 && <RatingBadge rating={country.avgRating} />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
