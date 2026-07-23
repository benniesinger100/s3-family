// Logic for the visit date and the texting window.
// Texts should fire only when a change happens within ONE DAY of arrival —
// i.e. from the start of the day before arrival through the end of arrival day.

const MS_DAY = 86400000

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Parse a 'YYYY-MM-DD' string as a LOCAL date (avoids UTC off-by-one).
export function parseDate(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

// Whole days from today until arrival. 0 = arrives today, 1 = tomorrow,
// negative = already passed.
export function daysUntil(arrivalDate) {
  const arrival = parseDate(arrivalDate)
  if (!arrival) return null
  return Math.round((arrival - startOfToday()) / MS_DAY)
}

// True when we're inside the notify window (day before arrival, or arrival day).
export function isWithinOneDay(arrivalDate) {
  const days = daysUntil(arrivalDate)
  return days !== null && days <= 1 && days >= 0
}

// Friendly status text for the dashboard.
export function visitStatus(arrivalDate) {
  const days = daysUntil(arrivalDate)
  if (days === null) return { armed: false, text: 'No visit date set yet.' }
  if (days < 0) return { armed: false, text: 'That visit date has passed.' }
  if (days === 0) return { armed: true, text: 'Arriving today — texts are ON for any list changes.' }
  if (days === 1) return { armed: true, text: 'Arriving tomorrow — texts are ON for any list changes.' }
  return { armed: false, text: `Arriving in ${days} days — texts start the day before.` }
}
