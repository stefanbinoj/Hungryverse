
// Deterministic mock data (no randomness) to avoid hydration mismatches.

// Daily: 24 hours (labels 00-23), busier during daytime using a sine curve
export const dailyFeedbackCounts = Array.from({ length: 24 }).map((_, i) => {
  // Base 2, daytime bump up to +10
  const base = 2
  const daytime = i >= 8 && i <= 20 ? 10 * Math.sin(((i - 8) / 12) * Math.PI) : 0
  return {
    label: String(i).padStart(2, "0"),
    count: Math.max(0, Math.round(base + daytime)),
  }
})

// Weekly: Mon-Sun, weekdays higher than weekends
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const weeklyFeedbackCounts = weekDays.map((label, idx) => {
  const isWeekend = idx >= 5
  const base = isWeekend ? 24 : 40
  // slight wave across the week for visual interest
  const wave = Math.round(6 * Math.sin((idx / 6) * Math.PI))
  return { label, count: base + wave }
})

// Monthly: last 30 days with gentle variation
export const monthlyFeedbackCounts = Array.from({ length: 30 }).map((_, i) => {
  const base = 28
  const wave = Math.round(10 * Math.sin((i / 29) * Math.PI)) // peak mid-month
  return { label: `${i + 1}`, count: base + wave }
})

// Ratings: recent ratings (1..5) used for average rating
export const ratings: number[] = [
  5, 4, 5, 4, 3, 5, 4, 4, 5, 3, 4, 5, 5, 4, 4, 3, 5, 5, 4, 4, 5, 3, 4, 5, 4, 4, 5, 5, 4, 3,
]

// Category-specific ratings to support per-category stars in the metrics UI
export const categoryRatings = {
  cleanliness: [5, 4, 4, 5, 5, 4, 4, 3, 5, 4, 5, 4, 4, 5, 5, 4],
  service: [4, 4, 3, 4, 5, 4, 4, 4, 3, 4, 5, 4, 4, 3, 4, 4],
  food: [5, 5, 4, 5, 4, 4, 5, 5, 3, 4, 5, 5, 4, 5, 4, 4],
}
