export default function IdentityPicker({ onPick }) {
  return (
    <div className="picker">
      <h1 className="picker-title">Waterloo Visit List</h1>
      <p className="picker-subtitle">Who are you?</p>
      <div className="picker-buttons">
        <button className="picker-btn bennie" onClick={() => onPick('Bennie')}>
          Bennie
        </button>
        <button className="picker-btn leora" onClick={() => onPick('Leora')}>
          Leora
        </button>
        <button className="picker-btn mom" onClick={() => onPick('Mom')}>
          Mom
        </button>
      </div>
    </div>
  )
}
