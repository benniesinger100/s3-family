// All week math lives here. A "week" is identified by the date of its Monday,
// stored as a 'YYYY-MM-DD' string. Items reference that Monday plus a day_index
// (0 = Mon … 6 = Sun), which makes loading a whole week a single equality query.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Format a Date as a local 'YYYY-MM-DD' string (no timezone surprises).
export function fmt(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Parse a 'YYYY-MM-DD' string into a local Date at midnight.
export function parse(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// The Monday on or before the given date, as a 'YYYY-MM-DD' string.
export function mondayOf(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dow = (d.getDay() + 6) % 7 // convert Sun=0..Sat=6 into Mon=0..Sun=6
  d.setDate(d.getDate() - dow)
  return fmt(d)
}

export function thisWeek() {
  return mondayOf(new Date())
}

export function addWeeks(weekStart, n) {
  const d = parse(weekStart)
  d.setDate(d.getDate() + n * 7)
  return fmt(d)
}

export function isThisWeek(weekStart) {
  return weekStart === thisWeek()
}

// The actual calendar Date for a given day within a week.
export function dateOfDay(weekStart, dayIndex) {
  const d = parse(weekStart)
  d.setDate(d.getDate() + dayIndex)
  return d
}

// Human label like "Jun 15 – Jun 21".
export function weekLabel(weekStart) {
  const start = parse(weekStart)
  const end = dateOfDay(weekStart, 6)
  const opts = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`
}
