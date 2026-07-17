import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'

const PEOPLE = ['Bennie', 'Leora']

// Renders one card: a heading plus its items, optionally split into sub-groups.
function Card({ title, colorClass, groups }) {
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
                <li key={item.id} className="item">
                  <span className="item-text">{item.text}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ items, loading, onSwitch }) {
  const [groupBy, setGroupBy] = useState('person') // 'person' | 'category'

  // One card per person, split into category sub-groups.
  const byPerson = PEOPLE.map((person) => ({
    title: `${person}'s Lists`,
    colorClass: `dash-col-${person.toLowerCase()}`,
    groups: CATEGORIES.map((cat) => ({
      label: cat,
      items: items.filter((i) => i.person === person && i.category === cat),
    })),
  }))

  // One card per category, split into person sub-groups.
  const byCategory = CATEGORIES.map((cat) => ({
    title: cat,
    colorClass: `dash-col-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`,
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

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <div className="dash-grid">
          {cards.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      )}
    </div>
  )
}
