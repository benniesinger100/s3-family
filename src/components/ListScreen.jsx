import { useState } from 'react'

export default function ListScreen({ identity, items, loading, onSwitch, onAdd, onDelete }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const myItems = items.filter((i) => i.person === identity)

  async function submit(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setBusy(true)
    try {
      await onAdd({ person: identity, text: t })
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
        <h1 className="name">{identity}'s List</h1>
        <button className="switch-btn" onClick={onSwitch}>
          Switch
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <>
          <ul className="items-list">
            {myItems.length === 0 ? (
              <li className="empty">Nothing yet — add something below!</li>
            ) : (
              myItems.map((item) => (
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

          <form className="add-form" onSubmit={submit}>
            <input
              className="add-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add an item…"
              maxLength={200}
            />
            <button className="add-btn" disabled={busy || !text.trim()}>
              Add
            </button>
          </form>
        </>
      )}
    </div>
  )
}
