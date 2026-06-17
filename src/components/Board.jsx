import { PEOPLE } from '../lib/people'
import PersonPanel from './PersonPanel'

// The week at a glance: one comic panel per person.
export default function Board({ weekStart, items, identity, onAdd, onDelete }) {
  return (
    <div className="board">
      {PEOPLE.map((p) => (
        <PersonPanel
          key={p.name}
          person={p}
          weekStart={weekStart}
          items={items.filter((i) => i.person === p.name)}
          isMe={p.name === identity}
          onAdd={onAdd}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
