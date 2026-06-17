import { createClient } from '@supabase/supabase-js'

// These come from .env.local (and from Vercel env vars in production).
// Vite only exposes vars prefixed with VITE_ to the browser.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If the keys aren't set yet, `supabase` is null and the app falls back to
// localStorage (demo mode). The moment you add real keys, it goes live.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const hasSupabase = Boolean(supabase)
