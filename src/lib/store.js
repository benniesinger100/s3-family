import { supabase, hasSupabase } from './supabase'

const LS_ITEMS = 'waterloo_items'

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
    const { error } = await supabase.from('items').insert({ person, text, category })
    if (error) throw error
    return
  }
  const items = lsRead()
  items.push({ id: uid(), person, text, category, created_at: new Date().toISOString() })
  lsWrite(items)
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

// ===== Realtime =====
export function subscribe(onChange) {
  if (hasSupabase) {
    const channel = supabase
      .channel('items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, onChange)
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
