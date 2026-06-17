import { PEOPLE } from '../lib/people'

// First screen: tap who you are. The choice is remembered on the device,
// so this only shows up once (until you tap "switch" later).
export default function IdentityPicker({ onPick }) {
  return (
    <div className="picker">
      <div className="picker-logo">S³</div>
      <p className="picker-tag">our family week</p>
      <h2 className="picker-q">Who are you?</h2>
      <div className="picker-grid">
        {PEOPLE.map((p) => (
          <button
            key={p.name}
            className="picker-btn"
            style={{ '--c': p.color, '--soft': p.soft }}
            onClick={() => onPick(p.name)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <p className="picker-foot">Tap your name — this phone will remember you.</p>
    </div>
  )
}
