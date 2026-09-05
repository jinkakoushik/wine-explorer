require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const Wine = require('../models/Wine');
const User = require('../models/User');
const Review = require('../models/Review');
const { bottleSvg } = require('./wineArt');
const winesPart1 = require('./seedWines1');
const winesPart2 = require('./seedWines2');

const allWines = [...winesPart1, ...winesPart2];

// Demo accounts available for reviewers to log in with
const demoUsers = [
  { name: 'Ava Laurent', email: 'ava@example.com', password: 'password123' },
  { name: 'Diego Herrera', email: 'diego@example.com', password: 'password123' },
  { name: 'Maya Chen', email: 'maya@example.com', password: 'password123' },
];

const reviewSeeds = [
  { email: 'ava@example.com', wine: 'Château Margaux Grand Vin', rating: 5, comment: 'An unforgettable bottle. The perfume alone is worth the price of admission — violets, cassis, and cedar that kept evolving over three hours. Decanted for an hour and it just kept giving.' },
  { email: 'diego@example.com', wine: 'Château Margaux Grand Vin', rating: 5, comment: 'Everything a great Bordeaux should be. Structured yet already generous. Saving my next bottle for a milestone anniversary.' },
  { email: 'maya@example.com', wine: 'Tignanello', rating: 5, comment: 'Sangiovese at its most luxurious. Dark cherry, sweet spice, and a finish that goes on forever. Pairs perfectly with a Tuscan steak night.' },
  { email: 'ava@example.com', wine: 'Tignanello', rating: 4, comment: 'Excellent, though I would give it another five years to fully integrate the oak. Still a stunning wine right now.' },
  { email: 'diego@example.com', wine: 'Cloudy Bay Sauvignon Blanc', rating: 4, comment: 'Exactly what you want from Marlborough — electric passionfruit and lime. Iced it down properly and it disappeared fast at our barbecue.' },
  { email: 'maya@example.com', wine: 'Cloudy Bay Sauvignon Blanc', rating: 5, comment: 'Still the benchmark. Bright, herbaceous, and impossible to dislike. My house white for summer.' },
  { email: 'ava@example.com', wine: 'Caymus Special Selection', rating: 4, comment: 'Opulent, plush, and unapologetically Napa. A touch modern for my usual taste, but the quality is undeniable.' },
  { email: 'diego@example.com', wine: 'Sula Chenin Blanc', rating: 4, comment: 'Genuinely impressed. Off-dry but balanced, with lovely tropical fruit. Proof that Nashik deserves attention.' },
  { email: 'maya@example.com', wine: 'Sula Chenin Blanc', rating: 3, comment: 'Pleasant everyday pour with good acidity. A little simple compared to Loire chenin, but great value.' },
  { email: 'ava@example.com', wine: 'Quinta do Vale Meão', rating: 5, comment: 'Douro greatness. Violets, slate, and incredibly fine tannins. Opened alongside a port and honestly preferred the table wine.' },
  { email: 'diego@example.com', wine: 'Gran Reserva 904', rating: 5, comment: 'Classic Rioja perfection — dried cherry, cedar, and silky vanilla. The 2015 is singing right now.' },
  { email: 'maya@example.com', wine: 'Almaviva', rating: 5, comment: 'Chile showing its world-class credentials. Minty cassis and velvet tannins — blind tasted it against a second-growth Bordeaux and it held its own.' },
  { email: 'ava@example.com', wine: 'Brut Réserve', rating: 5, comment: 'The best non-vintage champagne on the market, full stop. Brioche and poached pear with unreal depth from the reserve wines.' },
  { email: 'diego@example.com', wine: 'Whispering Angel Rosé', rating: 4, comment: 'The crowd-pleaser that actually delivers. Dry, clean, and endlessly quaffable. Poolside staple.' },
  { email: 'maya@example.com', wine: 'Frasers Fairview Sauvignon Blanc', rating: 4, comment: 'Crisp and vibrant with real grapefruit punch. Excellent value for Cape sauvignon.' },
  { email: 'diego@example.com', wine: 'Tokaji Aszú 5 Puttonyos', rating: 5, comment: 'Liquid gold. Apricot and saffron with an acidity that keeps it weightless despite all that sugar.' },
  { email: 'ava@example.com', wine: 'Tokaji Aszú 5 Puttonyos', rating: 5, comment: 'History in a glass and still thrilling. The finish lasts a full minute.' },
];

const favoritesByUser = {
  'ava@example.com': ['Château Margaux Grand Vin', 'Brut Réserve', 'Tokaji Aszú 5 Puttonyos'],
  'diego@example.com': ['Tignanello', 'Gran Reserva 904', 'Whispering Angel Rosé'],
  'maya@example.com': ['Cloudy Bay Sauvignon Blanc', 'Almaviva'],
};

/**
 * Seeds the database.
 * - Wines are upserted on the { name, winery } unique index, so re-running
 *   the seeder never creates duplicates.
 * - Reviews are upserted per (user, wine), and ratings are recalculated.
 * - Demo users are created only if missing, so user changes are preserved.
 * Pass --destroy to clear all collections instead.
 */
const seed = async () => {
  let connected = false;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    connected = true;
    console.log('✓ Connected to MongoDB for seeding');

    if (process.argv.includes('--destroy')) {
      await Promise.all([Wine.deleteMany(), User.deleteMany(), Review.deleteMany()]);
      console.log('✗ Database cleared (wines, users, reviews)');
      await mongoose.connection.close();
      process.exit(0);
    }

    // ----- Wines: upsert on { name, winery } -----
    let winesCreated = 0;
    let winesUpdated = 0;
    const wines = [];

    for (const w of allWines) {
      const doc = {
        ...w,
        // Curated score preserved separately so it can be restored if all
        // community reviews are ever deleted
        baseRating: w.rating,
        image: bottleSvg({ name: w.name, winery: w.winery, type: w.type, vintage: w.vintage }),
      };
      const wine = await Wine.findOneAndUpdate(
        { name: w.name, winery: w.winery },
        doc,
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      wines.push(wine);
      if (wine.createdAt && wine.updatedAt && wine.createdAt.getTime() !== wine.updatedAt.getTime()) {
        winesUpdated += 1;
      } else {
        winesCreated += 1;
      }
    }
    console.log(`✓ Wines: ${winesCreated} created, ${winesUpdated} updated (no duplicates)`);

    // ----- Users: create only if missing (preserves favorites made in the app) -----
    let usersCreated = 0;
    const users = [];
    for (const u of demoUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
        usersCreated += 1;
      }
      users.push(user);
    }
    console.log(`✓ Users: ${usersCreated} created, ${demoUsers.length - usersCreated} already present`);

    // ----- Reviews: upsert per (user, wine) -----
    const emailToUser = Object.fromEntries(users.map((u) => [u.email, u]));
    const nameToWine = Object.fromEntries(wines.map((w) => [w.name, w]));

    let reviewsCreated = 0;
    let reviewsUpdated = 0;
    let reviewsSkipped = 0;

    for (const r of reviewSeeds) {
      const user = emailToUser[r.email];
      const wine = nameToWine[r.wine];
      if (!user || !wine) {
        reviewsSkipped += 1;
        console.warn(`⚠ Skipping review: missing ${!user ? `user ${r.email}` : `wine "${r.wine}"`}`);
        continue;
      }
      const existing = await Review.findOne({ user: user._id, wine: wine._id });
      if (existing) {
        existing.rating = r.rating;
        existing.comment = r.comment;
        await existing.save();
        reviewsUpdated += 1;
      } else {
        await Review.create({ user: user._id, wine: wine._id, rating: r.rating, comment: r.comment });
        reviewsCreated += 1;
      }
    }
    console.log(`✓ Reviews: ${reviewsCreated} created, ${reviewsUpdated} updated, ${reviewsSkipped} skipped`);

    // ----- Recalculate ratings so wine docs match their reviews -----
    for (const wine of wines) {
      await Wine.recalcRating(wine._id);
    }
    console.log('✓ Wine ratings recalculated from reviews');

    // ----- Favorites: resolve by wine name, skip unknown entries safely -----
    for (const [email, names] of Object.entries(favoritesByUser)) {
      const user = emailToUser[email];
      user.favorites = names
        .map((n) => nameToWine[n])
        .filter(Boolean)
        .map((w) => w._id);
      await user.save();
    }
    console.log('✓ Demo favorites set');

    console.log('\n✓ Seed complete. Demo logins (password: password123):');
    demoUsers.forEach((u) => console.log(`   ${u.email}`));

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message || err);
    if (connected) await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
