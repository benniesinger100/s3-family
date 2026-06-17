import { useState } from 'react'
import { DAYS } from '../lib/week'

// One person's week. Items are grouped under day headings. If this panel is
// "you", an add form appears at the bottom and items get a delete button.
export default function PersonPanel({ person, items, weekStart, isMe, onAdd, onDelete }) {
  const [text, setText] = useState('')
  const [day, setDay] = useState(() => (new Date().getDay() + 6) % 7) // default to today
  const [busy, setBusy] = useState(false)

  // Bucket items by day_index so we can render day groups in order.
  const byDay = {}
  for (const it of items) {
    ;(byDay[it.day_index] ||= []).push(it)
  }

  async function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setBusy(true)
    try {
      await onAdd({ person: person.name, week_start: weekStart, day_index: day, text: t })
      setText('')
    } catch (err) {
      alert('Could not add that — please try again.')
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel" style={{ '--c': person.color, '--soft': person.soft }}>
      <div className="panel-head">
        {person.icon && <img src={person.icon} alt={person.name} className="panel-icon" />}
        <span className="panel-name">{person.name}</span>
        {isMe && <span className="panel-you">you</span>}
      </div>

      <div className="panel-body">
        {items.length === 0 && (
          <p className="panel-empty">Nothing yet{isMe ? ' — add something below!' : ''}</p>
        )}
        {DAYS.map(
          (d, idx) =>
            byDay[idx] && (
              <div className="day-group" key={idx}>
                <div className="day-label">{d}</div>
                <ul className="day-items">
                  {byDay[idx].map((it) => (
                    <li key={it.id} className="item">
                      <span className="item-text">{it.text}</span>
                      {isMe && (
                        <button
                          className="item-del"
                          onClick={() => onDelete(it.id)}
                          aria-label="Delete item"
                        >
                          ×
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>

      {isMe && (
        <form className="add-form" onSubmit={submit}>
          <input
            className="add-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. STAT 341 midterm"
            maxLength={120}
          />
          <div className="add-row">
            <select className="add-day" value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {DAYS.map((d, idx) => (
                <option key={idx} value={idx}>
                  {d}
                </option>
              ))}
            </select>
            <button className="add-btn" disabled={busy || !text.trim()}>
              Add
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
