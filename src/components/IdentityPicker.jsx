import { ArchieIcon, WhaleIcon } from './Motifs'

export default function IdentityPicker({ onPick }) {
  return (
    <div className="picker">
      <h1 className="picker-title">Waterloo Visit List</h1>
      <p className="picker-subtitle">Who are you?</p>
      <div className="picker-buttons">
        <button className="picker-btn bennie" onClick={() => onPick('Bennie')}>
          <ArchieIcon className="picker-motif" />
          Bennie
        </button>
        <button className="picker-btn leora" onClick={() => onPick('Leora')}>
          <WhaleIcon className="picker-motif" />
          Leora
        </button>
        <button className="picker-btn moms" onClick={() => onPick('Moms')}>
          Moms
        </button>
      </div>
    </div>
  )
}
