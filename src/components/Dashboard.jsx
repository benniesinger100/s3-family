function Column({ name, items }) {
  return (
    <div className={`dash-col dash-col-${name.toLowerCase()}`}>
      <h2 className="dash-name">{name}'s List</h2>
      <ul className="items-list">
        {items.length === 0 ? (
          <li className="empty">Nothing yet</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="item">
              <span className="item-text">{item.text}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default function Dashboard({ items, loading, onSwitch }) {
  const bennie = items.filter((i) => i.person === 'Bennie')
  const leora = items.filter((i) => i.person === 'Leora')

  return (
    <div className="screen screen-mom">
      <div className="header">
        <h1 className="name">Both Lists</h1>
        <button className="switch-btn" onClick={onSwitch}>
          Switch
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <div className="dash-grid">
          <Column name="Bennie" items={bennie} />
          <Column name="Leora" items={leora} />
        </div>
      )}
    </div>
  )
}
