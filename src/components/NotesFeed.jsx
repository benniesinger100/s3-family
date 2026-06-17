import { useState } from 'react'
import { personByName } from '../lib/people'

// Short, friendly relative time like "5m ago".
function timeAgo(iso) {
  const secs = (Date.now() - new Date(iso).getTime()) / 1000
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

// The encouragement feed: post a message, see everyone's as speech bubbles.
export default function NotesFeed({ notes, identity, onAdd }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setBusy(true)
    try {
      await onAdd({ author: identity, text: t })
      setText('')
    } catch (err) {
      alert('Could not post that — please try again.')
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="notes">
      <h2 className="section-title">Notes &amp; Cheers</h2>
      <form className="note-form" onSubmit={submit}>
        <input
          className="note-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something nice…"
          maxLength={200}
        />
        <button className="note-btn" disabled={busy || !text.trim()}>
          Post
        </button>
      </form>

      <ul className="note-list">
        {notes.length === 0 && (
          <li className="note-empty">No messages yet — be the first to cheer someone on!</li>
        )}
        {notes.map((n) => {
          const p = personByName(n.author)
          const color = p ? p.color : '#777'
          return (
            <li key={n.id} className="bubble-row">
              <div className="bubble" style={{ '--c': color }}>
                <p className="bubble-text">{n.text}</p>
              </div>
              <div className="bubble-meta">
                <span className="bubble-who" style={{ color }}>
                  {n.author}
                </span>{' '}
                · {timeAgo(n.created_at)}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
