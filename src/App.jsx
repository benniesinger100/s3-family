import { useEffect, useState, useCallback } from 'react'
import { thisWeek } from './lib/week'
import { hasSupabase } from './lib/supabase'
import * as store from './lib/store'
import IdentityPicker from './components/IdentityPicker'
import Header from './components/Header'
import WeekNav from './components/WeekNav'
import Board from './components/Board'
import CopyWeek from './components/CopyWeek'
import NotesFeed from './components/NotesFeed'

const ID_KEY = 's3_identity'

export default function App() {
  const [identity, setIdentity] = useState(() => localStorage.getItem(ID_KEY))
  const [weekStart, setWeekStart] = useState(thisWeek())
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  // Reload everything for the current week. Re-created when the week changes.
  const reload = useCallback(async () => {
    try {
      const [it, nt] = await Promise.all([store.fetchItems(weekStart), store.fetchNotes()])
      setItems(it)
      setNotes(nt)
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setLoading(false)
    }
  }, [weekStart])

  // Load on mount / whenever the week changes.
  useEffect(() => {
    setLoading(true)
    reload()
  }, [reload])

  // Live updates: refetch whenever anything changes anywhere.
  useEffect(() => store.subscribe(reload), [reload])

  function chooseIdentity(name) {
    localStorage.setItem(ID_KEY, name)
    setIdentity(name)
  }
  function switchIdentity() {
    localStorage.removeItem(ID_KEY)
    setIdentity(null)
  }

  if (!identity) return <IdentityPicker onPick={chooseIdentity} />

  return (
    <div className="app">
      <Header identity={identity} onSwitch={switchIdentity} />

      {!hasSupabase && (
        <div className="banner">
          Demo mode — data lives only on this device. Add your Supabase keys to go live for everyone.
        </div>
      )}

      <WeekNav weekStart={weekStart} onChange={setWeekStart} />

      {loading ? (
        <p className="loading">Loading…</p>
      ) : (
        <Board
          weekStart={weekStart}
          items={items}
          identity={identity}
          onAdd={store.addItem}
          onDelete={store.deleteItem}
        />
      )}

      <CopyWeek weekStart={weekStart} items={items} />

      <NotesFeed notes={notes} identity={identity} onAdd={store.addNote} />

      <footer className="footer">S³ · made with love</footer>
    </div>
  )
}
