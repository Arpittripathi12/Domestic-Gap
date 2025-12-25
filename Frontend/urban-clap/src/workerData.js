const SKILL_BASE_PRICE = {
  Carpenter: 176,
  Plumber: 149,
  Electrician: 159,
  Chef: 149,
  "AC & Appliances Repair": 198,
  Painter: 156,
  "Home Cleaning": 159,
};

export function predictWorkerBasePrice({
  skill,
  experience,   // years
  rating,       // 0 - 5
  distance,     // meters
}) {
  // 1️⃣ Base price by skill
  const basePrice = SKILL_BASE_PRICE[skill] || 299;

  // 2️⃣ Experience bonus
  let experienceBonus = 0;
  if (experience >= 3 && experience < 6) experienceBonus = 50;
  else if (experience >= 6 && experience < 10) experienceBonus = 100;
  else if (experience >= 10) experienceBonus = 150;

  // 3️⃣ Rating bonus
  let ratingBonus = 0;
  if (rating >= 4.8) ratingBonus = 120;
  else if (rating >= 4.5) ratingBonus = 80;
  else if (rating >= 4.0) ratingBonus = 40;

  // 4️⃣ Distance charge (first 3 km free)
  const distanceKm = distance / 1000;
  let distanceCharge = 0;
  if (distanceKm > 3) {
    distanceCharge = Math.ceil(distanceKm - 3) * 20;
  }

  // 5️⃣ Final price
  const finalPrice =
    basePrice +
    experienceBonus +
    ratingBonus +
    distanceCharge;

  return Math.round(finalPrice);
}
