import { useState } from 'react'
import { PEOPLE } from '../lib/people'
import { DAYS, weekLabel } from '../lib/week'

// Turn the current week into clean plain text for pasting into iMessage.
function buildText(weekStart, items) {
  let out = `S³ — week of ${weekLabel(weekStart)}\n\n`
  for (const p of PEOPLE) {
    const mine = items.filter((i) => i.person === p.name)
    out += `${p.name}\n`
    if (mine.length === 0) {
      out += `  (nothing yet)\n`
    } else {
      const byDay = {}
      for (const it of mine) {
        ;(byDay[it.day_index] ||= []).push(it.text)
      }
      DAYS.forEach((d, idx) => {
        if (byDay[idx]) byDay[idx].forEach((t) => (out += `  ${d}: ${t}\n`))
      })
    }
    out += `\n`
  }
  return out.trim()
}

export default function CopyWeek({ weekStart, items }) {
  const [done, setDone] = useState(false)

  async function copy() {
    const text = buildText(weekStart, items)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older mobile browsers without the async clipboard API.
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setDone(true)
    setTimeout(() => setDone(false), 2200)
  }

  return (
    <div className="copyweek">
      <button className="copy-btn" onClick={copy}>
        {done ? '✓ Copied — paste into iMessage!' : '📋 Copy this week for iMessage'}
      </button>
    </div>
  )
}
