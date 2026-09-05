import BottleImage from '../ui/BottleImage.jsx';
import { RatingBadge } from '../ui/Rating.jsx';
import FavoriteButton from '../ui/FavoriteButton.jsx';

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest2 text-ink-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink-100">{value}</p>
    </div>
  );
}

/**
 * The main wine detail presentation: hero with bottle + key facts,
 * description, tasting notes, and food pairings.
 */
export default function WineDetails({ wine }) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Bottle */}
        <div className="card-dark relative flex items-center justify-center overflow-hidden p-10">
          <div className="absolute inset-0 bg-hero-radial" />
          <BottleImage
            src={wine.image}
            alt={`${wine.name} bottle`}
            className="relative z-10 h-96 max-w-full drop-shadow-2xl"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300 backdrop-blur-md">
            {wine.type}
          </span>
          <span className="absolute right-4 top-4">
            <FavoriteButton wineId={wine._id} name={wine.name} size="lg" />
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="label-caps">{wine.country} · {wine.region}</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
            {wine.name}
          </h1>
          <p className="mt-2 text-lg text-ink-300">by {wine.winery}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <RatingBadge rating={wine.rating} numReviews={wine.numReviews} size="lg" />
            <span className="font-display text-3xl font-semibold text-gold-300">
              ${Number(wine.price).toFixed(2)}
            </span>
            {wine.vintage && <span className="text-sm text-ink-400">Vintage {wine.vintage}</span>}
          </div>

          <p className="mt-6 leading-relaxed text-ink-300">{wine.description}</p>

          {/* Grapes + CTA row */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium text-gold-200">
              {wine.grape}
            </span>
            {wine.vintage && (
              <span className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-ink-300">
                {wine.vintage}
              </span>
            )}
            {wine.alcohol && (
              <span className="rounded-full border border-white/10 px-4 py-1.5 text-xs text-ink-300">
                {wine.alcohol}% ABV
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Facts grid */}
      <section>
        <h2 className="font-display text-2xl text-white">At a Glance</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Fact label="Type" value={wine.type} />
          <Fact label="Grape" value={wine.grape} />
          <Fact label="Vintage" value={wine.vintage} />
          <Fact label="Alcohol" value={wine.alcohol ? `${wine.alcohol}%` : null} />
          <Fact label="Body" value={wine.body} />
          <Fact label="Sweetness" value={wine.sweetness} />
          <Fact label="Acidity" value={wine.acidity} />
          <Fact label="Country" value={wine.country} />
          <Fact label="Region" value={wine.region} />
          <Fact label="Winery" value={wine.winery} />
          <Fact label="Price" value={`$${Number(wine.price).toFixed(2)}`} />
          <Fact
            label="Rating"
            value={wine.rating ? `${Number(wine.rating).toFixed(1)} / 5` : 'Not yet rated'}
          />
        </div>
      </section>

      {/* Tasting notes & pairings */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="card-dark p-6">
          <h3 className="label-caps">Tasting Notes</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(wine.tastingNotes || []).map((note) => (
              <span
                key={note}
                className="rounded-full border border-wine-500/25 bg-wine-950/40 px-3.5 py-1.5 text-sm text-wine-200"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
        <div className="card-dark p-6">
          <h3 className="label-caps">Food Pairings</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(wine.foodPairings || []).map((food) => (
              <span
                key={food}
                className="rounded-full border border-gold-500/25 bg-gold-950/40 px-3.5 py-1.5 text-sm text-gold-200"
              >
                🍽 {food}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
