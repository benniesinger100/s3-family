import { useState, useEffect } from 'react'
import { CATEGORIES } from '../lib/categories'
import { visitStatus } from '../lib/visit'
import ItemRow from './ItemRow'
import { MomsAvatar } from './Motifs'

// Moms sets when she's arriving (and the number to text).
// Texts fire only for changes within one day of that date.
function VisitSettings({ settings, onSave }) {
  const [date, setDate] = useState('')
  const [notifyTo, setNotifyTo] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDate(settings.arrival_date || '')
    setNotifyTo(settings.notify_to || '')
  }, [settings.arrival_date, settings.notify_to])

  const status = visitStatus(settings.arrival_date)

  async function save(e) {
    e.preventDefault()
    try {
      await onSave({ arrival_date: date || null, notify_to: notifyTo || null })
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      alert('Could not save. Please try again.')
      console.error(err)
    }
  }

  return (
    <form className="visit-panel" onSubmit={save}>
      <div className="visit-fields">
        <label className="visit-field">
          <span className="visit-label">When are you arriving?</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="visit-input" />
        </label>
        <label className="visit-field">
          <span className="visit-label">Send alerts to</span>
          <input
            type="text"
            value={notifyTo}
            onChange={(e) => setNotifyTo(e.target.value)}
            placeholder="mom@example.com"
            className="visit-input"
          />
        </label>
        <button className="visit-save">{saved ? 'Saved ✓' : 'Save'}</button>
      </div>
      <p className={`visit-status ${status.armed ? 'armed' : ''}`}>
        {status.armed ? '🔔 ' : '🔕 '}
        {status.text} Max 2 alerts a day.
      </p>
    </form>
  )
}

const PEOPLE = ['Bennie', 'Leora']

// Renders one card: a heading plus its items, optionally split into sub-groups.
function Card({ title, colorClass, groups, onUpdate }) {
  return (
    <div className={`dash-col ${colorClass}`}>
      <h2 className="dash-name">{title}</h2>
      {groups.map((g) => (
        <div key={g.label} className="dash-subgroup">
          <h3 className="dash-sublabel">{g.label}</h3>
          <ul className="items-list">
            {g.items.length === 0 ? (
              <li className="empty">Nothing yet</li>
            ) : (
              g.items.map((item) => (
                <ItemRow key={item.id} item={item} mode="mom" onUpdate={onUpdate} />
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({
  items,
  settings = {},
  loading,
  onSwitch,
  onUpdate,
  onClearPacked,
  onSaveSettings,
}) {
  const [groupBy, setGroupBy] = useState('person') // 'person' | 'category'

  const packedCount = items.filter((i) => i.status === 'packed').length

  async function markDelivered() {
    if (!packedCount) return
    if (!window.confirm(`Mark all ${packedCount} packed item(s) as delivered? This clears them from every list.`)) return
    await onClearPacked()
  }

  const byPerson = PEOPLE.map((person) => ({
    title: `${person}'s Lists`,
    colorClass: `dash-col-${person.toLowerCase()}`,
    groups: CATEGORIES.map((cat) => ({
      label: cat,
      items: items.filter((i) => i.person === person && i.category === cat),
    })),
  }))

  const byCategory = CATEGORIES.map((cat) => ({
    title: cat,
    colorClass: 'dash-col-cat',
    groups: PEOPLE.map((person) => ({
      label: person,
      items: items.filter((i) => i.person === person && i.category === cat),
    })),
  }))

  const cards = groupBy === 'person' ? byPerson : byCategory

  return (
    <div className="screen screen-mom">
      <div className="header">
        <div className="brand">
          <MomsAvatar className="motif" />
          <h1 className="name">Both Lists</h1>
        </div>
        <button className="switch-btn" onClick={onSwitch}>
          Not Moms?
        </button>
      </div>

      <VisitSettings settings={settings} onSave={onSaveSettings} />

      <div className="dash-controls">
        <div className="toggle">
          <button
            className={`toggle-btn ${groupBy === 'person' ? 'active' : ''}`}
            onClick={() => setGroupBy('person')}
          >
            By Person
          </button>
          <button
            className={`toggle-btn ${groupBy === 'category' ? 'active' : ''}`}
            onClick={() => setGroupBy('category')}
          >
            By Category
          </button>
        </div>
        <button className="delivered-btn" onClick={markDelivered} disabled={!packedCount}>
          🎒 Mark all delivered{packedCount ? ` (${packedCount})` : ''}
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <div className="dash-grid">
          {cards.map((card) => (
            <Card key={card.title} {...card} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
