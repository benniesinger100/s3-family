import { supabase, hasSupabase } from './supabase'

const LS_ITEMS = 'waterloo_items'
const LS_SETTINGS = 'waterloo_settings'

function lsRead() {
  try {
    return JSON.parse(localStorage.getItem(LS_ITEMS) || '[]')
  } catch {
    return []
  }
}

function lsWrite(items) {
  localStorage.setItem(LS_ITEMS, JSON.stringify(items))
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const localListeners = new Set()
function emitLocal() {
  localListeners.forEach((fn) => fn())
}

// ===== Items =====
export async function fetchAllItems() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: true })
    if (error) throw error
    return data
  }
  return lsRead()
}

export async function addItem({ person, text, category }) {
  if (hasSupabase) {
    const { error } = await supabase.from('items').insert({ person, text, category, status: 'entered' })
    if (error) throw error
    return
  }
  const items = lsRead()
  items.push({ id: uid(), person, text, category, status: 'entered', created_at: new Date().toISOString() })
  lsWrite(items)
  emitLocal()
}

// Patch any fields on an item (text, category, status).
export async function updateItem(id, patch) {
  if (hasSupabase) {
    const { error } = await supabase.from('items').update(patch).eq('id', id)
    if (error) throw error
    return
  }
  lsWrite(lsRead().map((i) => (i.id === id ? { ...i, ...patch } : i)))
  emitLocal()
}

// Mom's "delivered" action: remove every packed item at once.
export async function clearPacked() {
  if (hasSupabase) {
    const { error } = await supabase.from('items').delete().eq('status', 'packed')
    if (error) throw error
    return
  }
  lsWrite(lsRead().filter((i) => i.status !== 'packed'))
  emitLocal()
}

export async function deleteItem(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) throw error
    return
  }
  lsWrite(lsRead().filter((i) => i.id !== id))
  emitLocal()
}

// ===== Visit settings (arrival date + Moms' phone) =====
// Stored as a single row (id = 1) so everyone shares the same visit info.
export async function fetchSettings() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
    if (error) throw error
    return data || {}
  }
  try {
    return JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}')
  } catch {
    return {}
  }
}

export async function updateSettings(patch) {
  if (hasSupabase) {
    const { error } = await supabase.from('settings').upsert({ id: 1, ...patch })
    if (error) throw error
    return
  }
  const current = await fetchSettings()
  localStorage.setItem(LS_SETTINGS, JSON.stringify({ ...current, ...patch }))
  emitLocal()
}

// ===== Realtime =====
export function subscribe(onChange) {
  if (hasSupabase) {
    const channel = supabase
      .channel('items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, onChange)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }
  localListeners.add(onChange)
  return () => {
    localListeners.delete(onChange)
  }
}
