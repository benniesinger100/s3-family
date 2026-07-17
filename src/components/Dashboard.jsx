import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import ItemRow from './ItemRow'

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

export default function Dashboard({ items, loading, onSwitch, onUpdate, onClearPacked }) {
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
        <h1 className="name">Both Lists</h1>
        <button className="switch-btn" onClick={onSwitch}>
          Switch
        </button>
      </div>

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
