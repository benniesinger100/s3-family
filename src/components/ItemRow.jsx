import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

// One item row, shared by the owner list (Bennie/Leora) and Mom's dashboard.
// mode 'owner' -> edit text, move category, delete; packed items are locked.
// mode 'mom'   -> stage the item through New / Seen / Packed.
export default function ItemRow({ item, mode, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)

  const isPacked = item.status === 'packed'

  function saveEdit() {
    setEditing(false)
    const t = draft.trim()
    if (t && t !== item.text) onUpdate(item.id, { text: t })
    else setDraft(item.text)
  }

  // Owner view of a packed item: greyed, backpack, locked.
  if (mode === 'owner' && isPacked) {
    return (
      <li className="item item-packed">
        <span className="item-backpack" aria-hidden="true">🎒</span>
        <span className="item-text">{item.text}</span>
        <span className="item-locked">packed</span>
      </li>
    )
  }

  if (mode === 'owner') {
    const other = item.category === CATEGORIES[0] ? CATEGORIES[1] : CATEGORIES[0]
    return (
      <li className="item">
        {editing ? (
          <input
            className="item-edit"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') {
                setDraft(item.text)
                setEditing(false)
              }
            }}
            maxLength={200}
          />
        ) : (
          <button className="item-text item-text-btn" onClick={() => setEditing(true)} title="Tap to edit">
            {item.text}
          </button>
        )}
        {item.status === 'seen' && <span className="badge badge-seen">👀 Seen</span>}
        <button className="item-move" onClick={() => onUpdate(item.id, { category: other })}>
          → {other}
        </button>
        <button className="item-delete" onClick={() => onDelete(item.id)} aria-label="Delete">
          ×
        </button>
      </li>
    )
  }

  // Mom mode: stage control.
  const stages = [
    { key: 'entered', label: 'New' },
    { key: 'seen', label: 'Seen' },
    { key: 'packed', label: 'Packed' },
  ]
  return (
    <li className={`item item-mom ${isPacked ? 'item-mom-packed' : ''}`}>
      <span className="item-text">{item.text}</span>
      <div className="stage-control">
        {stages.map((s) => (
          <button
            key={s.key}
            className={`stage-pill ${item.status === s.key ? 'active' : ''}`}
            onClick={() => onUpdate(item.id, { status: s.key })}
          >
            {s.label}
          </button>
        ))}
      </div>
    </li>
  )
}
