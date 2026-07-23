import { useEffect, useState, useCallback } from 'react'
import { hasSupabase } from './lib/supabase'
import * as store from './lib/store'
import IdentityPicker from './components/IdentityPicker'
import ListScreen from './components/ListScreen'
import Dashboard from './components/Dashboard'

const ID_KEY = 'waterloo_identity'

export default function App() {
  const [identity, setIdentity] = useState(() => localStorage.getItem(ID_KEY))
  const [items, setItems] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const [all, s] = await Promise.all([store.fetchAllItems(), store.fetchSettings()])
      setItems(all)
      setSettings(s)
    } catch (err) {
      console.error('Failed to load', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    reload()
  }, [reload])

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
      {!hasSupabase && (
        <div className="banner">Demo mode — data saved locally only. Add Supabase keys to sync for real.</div>
      )}
      {identity === 'Moms' || identity === 'Mom' ? (
        <Dashboard
          items={items}
          settings={settings}
          loading={loading}
          onSwitch={switchIdentity}
          onUpdate={store.updateItem}
          onClearPacked={store.clearPacked}
          onSaveSettings={store.updateSettings}
        />
      ) : (
        <ListScreen
          identity={identity}
          items={items}
          loading={loading}
          onSwitch={switchIdentity}
          onAdd={store.addItem}
          onUpdate={store.updateItem}
          onDelete={store.deleteItem}
        />
      )}
    </div>
  )
}
