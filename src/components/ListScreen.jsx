import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CATEGORIES, DEFAULT_CATEGORY } from '../lib/categories'
import ItemRow from './ItemRow'
import { PersonMotif } from './Motifs'

// A draggable active item: drag to move between lists, tap text to edit.
function DraggableItem({ item, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)

  function saveEdit() {
    setEditing(false)
    const t = draft.trim()
    if (t && t !== item.text) onUpdate(item.id, { text: t })
    else setDraft(item.text)
  }

  // While editing we drop the drag listeners so typing/selection works freely.
  const dragProps = editing ? {} : { ...listeners, ...attributes }

  return (
    <li ref={setNodeRef} className={`item item-draggable ${isDragging ? 'item-dragging' : ''}`} {...dragProps}>
      <span className="drag-handle" aria-hidden="true">⠿</span>
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
      <button className="item-delete" onClick={() => onDelete(item.id)} aria-label="Delete">
        ×
      </button>
    </li>
  )
}

// A category is a drop zone. Dropping an item here moves it to this category.
function DroppableCategory({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <ul ref={setNodeRef} className={`items-list droppable ${isOver ? 'droppable-over' : ''}`}>
      {children}
    </ul>
  )
}

export default function ListScreen({ identity, items, loading, onSwitch, onAdd, onUpdate, onDelete }) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [busy, setBusy] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const myItems = items.filter((i) => i.person === identity)
  const active = myItems.filter((i) => i.status !== 'packed')
  const packed = myItems.filter((i) => i.status === 'packed')

  // Mouse: start after a small drag. Touch: press-and-hold so scrolling still works.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } })
  )

  const activeItem = activeId ? active.find((i) => i.id === activeId) : null

  function handleDragEnd(e) {
    setActiveId(null)
    const { active: dragged, over } = e
    if (!over) return
    const item = active.find((i) => i.id === dragged.id)
    if (item && CATEGORIES.includes(over.id) && over.id !== item.category) {
      onUpdate(item.id, { category: over.id })
    }
  }

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
        <div className="brand">
          <PersonMotif identity={identity} className="motif" />
          <h1 className="name">{identity}'s Lists</h1>
        </div>
        <button className="switch-btn" onClick={onSwitch}>
          Not {identity}?
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <>
          <p className="drag-hint">Tip: drag an item between lists to move it.</p>
          <DndContext
            sensors={sensors}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
          >
            {CATEGORIES.map((cat) => {
              const catItems = active.filter((i) => i.category === cat)
              return (
                <section key={cat} className="category">
                  <h2 className="category-title">{cat}</h2>
                  <DroppableCategory id={cat}>
                    {catItems.length === 0 ? (
                      <li className="empty">Drop items here</li>
                    ) : (
                      catItems.map((item) => (
                        <DraggableItem key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
                      ))
                    )}
                  </DroppableCategory>
                </section>
              )
            })}

            <DragOverlay>
              {activeItem ? <div className="item item-overlay">{activeItem.text}</div> : null}
            </DragOverlay>
          </DndContext>

          {packed.length > 0 && (
            <section className="category category-packed">
              <h2 className="category-title">🎒 Packed by Mom (locked)</h2>
              <ul className="items-list">
                {packed.map((item) => (
                  <ItemRow key={item.id} item={item} mode="owner" onUpdate={onUpdate} onDelete={onDelete} />
                ))}
              </ul>
            </section>
          )}

          <form className="add-form" onSubmit={submit}>
            <input
              className="add-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add an item…"
              maxLength={200}
            />
            <select className="add-select" value={category} onChange={(e) => setCategory(e.target.value)}>
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
