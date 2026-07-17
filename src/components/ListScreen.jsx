import { useState } from 'react'
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories'

export default function ListScreen({ identity, items, loading, onSwitch, onAdd, onDelete }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [busy, setBusy] = useState(false)

  const myItems = items.filter((i) => i.person === identity)

  async function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setBusy(true)
    try {
      await onAdd({ person: identity, text: t, category })
      setText('')
    } catch (err) {
      alert('Failed to add. Try again.')
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`screen screen-${identity.toLowerCase()}`}>
      <div className="header">
        <h1 className="name">{identity}'s Lists</h1>
        <button className="switch-btn" onClick={onSwitch}>
          Switch
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <>
          {CATEGORIES.map((cat) => {
            const catItems = myItems.filter((i) => i.category === cat)
            return (
              <section key={cat} className="category">
                <h2 className="category-title">{cat}</h2>
                <ul className="items-list">
                  {catItems.length === 0 ? (
                    <li className="empty">Nothing yet</li>
                  ) : (
                    catItems.map((item) => (
                      <li key={item.id} className="item">
                        <span className="item-text">{item.text}</span>
                        <button
                          className="item-delete"
                          onClick={() => onDelete(item.id)}
                          aria-label="Delete"
                        >
                          ×
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            )
          })}

          <form className="add-form" onSubmit={submit}>
            <input
              className="add-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add an item…"
              maxLength={200}
            />
            <select
              className="add-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button className="add-btn" disabled={busy || !text.trim()}>
              Add
            </button>
          </form>
        </>
      )}
    </div>
  )
}
