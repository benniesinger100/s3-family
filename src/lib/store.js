// The single data layer for the whole app. Every component talks to these
// functions and never touches Supabase or localStorage directly.
//
// If Supabase keys are configured -> real, shared, live data.
// If not -> a localStorage fallback so you can explore the UI on one device.
// The function signatures are identical either way, so the rest of the app
// doesn't care which one is active.

import { supabase, hasSupabase } from './supabase'

const LS_ITEMS = 's3_items'
const LS_NOTES = 's3_notes'

// ---------- localStorage helpers (demo mode only) ----------
function lsRead(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
function lsWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// In demo mode we notify subscribers ourselves; in live mode Supabase does it.
const localListeners = new Set()
function emitLocal() {
  localListeners.forEach((fn) => fn())
}

// ---------- ITEMS ----------
export async function fetchItems(weekStart) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('week_start', weekStart)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  }
  return lsRead(LS_ITEMS).filter((i) => i.week_start === weekStart)
}

export async function addItem({ person, week_start, day_index, text }) {
  if (hasSupabase) {
    const { error } = await supabase.from('items').insert({ person, week_start, day_index, text })
    if (error) throw error
    return
  }
  const items = lsRead(LS_ITEMS)
  items.push({ id: uid(), person, week_start, day_index, text, created_at: new Date().toISOString() })
  lsWrite(LS_ITEMS, items)
  emitLocal()
}

export async function deleteItem(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) throw error
    return
  }
  lsWrite(LS_ITEMS, lsRead(LS_ITEMS).filter((i) => i.id !== id))
  emitLocal()
}

// ---------- NOTES (the encouragement feed) ----------
export async function fetchNotes() {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data
  }
  return lsRead(LS_NOTES).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function addNote({ author, text }) {
  if (hasSupabase) {
    const { error } = await supabase.from('notes').insert({ author, text })
    if (error) throw error
    return
  }
  const notes = lsRead(LS_NOTES)
  notes.push({ id: uid(), author, text, created_at: new Date().toISOString() })
  lsWrite(LS_NOTES, notes)
  emitLocal()
}

// ---------- REALTIME ----------
// Calls `onChange` whenever items or notes change anywhere. Returns an
// unsubscribe function. In live mode this is a Supabase websocket channel.
export function subscribe(onChange) {
  if (hasSupabase) {
    const channel = supabase
      .channel('s3-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, onChange)
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
