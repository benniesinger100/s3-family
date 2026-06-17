import { weekLabel, addWeeks, thisWeek, isThisWeek } from '../lib/week'

// Move between weeks. Shows a "This week" button when you've navigated away,
// and a quiet label when you're already on the current week.
export default function WeekNav({ weekStart, onChange }) {
  const current = isThisWeek(weekStart)
  return (
    <div className="weeknav">
      <button className="wn-arrow" onClick={() => onChange(addWeeks(weekStart, -1))} aria-label="Previous week">
        ‹
      </button>
      <div className="wn-center">
        <div className="wn-label">{weekLabel(weekStart)}</div>
        {current ? (
          <div className="wn-tag wn-tag--now">this week</div>
        ) : (
          <button className="wn-tag wn-tag--btn" onClick={() => onChange(thisWeek())}>
            jump to this week
          </button>
        )}
      </div>
      <button className="wn-arrow" onClick={() => onChange(addWeeks(weekStart, 1))} aria-label="Next week">
        ›
      </button>
    </div>
  )
}
