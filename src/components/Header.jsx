import { personByName } from '../lib/people'

// The comic "title panel" logo plus a chip showing who you are.
// Tapping the chip lets you switch identity.
export default function Header({ identity, onSwitch }) {
  const me = personByName(identity)
  return (
    <header className="header">
      <div className="title-panel">
        <h1 className="logo">S³</h1>
      </div>
      <button className="me-chip" style={{ '--c': me.color }} onClick={onSwitch}>
        <span className="me-dot" />
        <span className="me-name">{identity}</span>
        <span className="me-switch">switch</span>
      </button>
    </header>
  )
}
