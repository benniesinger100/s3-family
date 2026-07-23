// Notifies Moms when the lists change, but ONLY:
//   - within one day of her arrival date (day before, or arrival day), and
//   - at most MAX_PER_DAY times per day, and
//   - not more often than DEBOUNCE_MINUTES apart (so 10 quick edits = 1 message).
//
// Triggered by a Supabase Database Webhook on the `items` table
// (INSERT / UPDATE / DELETE).
//
// Sends via Gmail SMTP. Requires these secrets to be set on the function:
//   GMAIL_USER            e.g. bennie.singer13@gmail.com
//   GMAIL_APP_PASSWORD    a Google "App Password" (NOT your normal password)
//
// Tip: to make it arrive as an actual TEXT instead of an email, set the
// "Send alerts to" field to a carrier email-to-SMS address, e.g.
//   5195550123@msg.telus.com   (Telus)
//   5195550123@txt.bell.ca     (Bell)
// Carrier support for these gateways varies and some have been retired.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const MAX_PER_DAY = 2
const DEBOUNCE_MINUTES = 30

// Local (Eastern) date pieces — Edge Functions run in UTC, and Waterloo is
// UTC-4/-5, so we shift before deciding what "today" is.
function easternNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }))
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: s } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
    if (!s?.arrival_date || !s?.notify_to) {
      return new Response('No arrival date or destination set — nothing to do.', { status: 200 })
    }

    // --- Is a change happening within one day of arrival? ---
    const now = easternNow()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [y, m, d] = s.arrival_date.split('-').map(Number)
    const arrival = new Date(y, m - 1, d)
    const daysUntil = Math.round((arrival.getTime() - today.getTime()) / 86400000)
    if (daysUntil > 1 || daysUntil < 0) {
      return new Response(`Outside the notify window (${daysUntil} days out).`, { status: 200 })
    }

    // --- Max 2 per day ---
    const todayStr = ymd(today)
    const sentToday = s.notify_count_date === todayStr ? (s.notify_count ?? 0) : 0
    if (sentToday >= MAX_PER_DAY) {
      return new Response('Daily limit reached.', { status: 200 })
    }

    // --- Debounce bursts of edits into one message ---
    if (s.last_notified_at) {
      const mins = (Date.now() - new Date(s.last_notified_at).getTime()) / 60000
      if (mins < DEBOUNCE_MINUTES) {
        return new Response('Debounced — sent recently.', { status: 200 })
      }
    }

    // --- Build a plain-text summary of both lists ---
    const { data: items } = await supabase
      .from('items')
      .select('*')
      .neq('status', 'packed')
      .order('created_at', { ascending: true })

    const lines: string[] = []
    for (const person of ['Bennie', 'Leora']) {
      lines.push(`${person}:`)
      for (const cat of ['Groceries', 'Bring from Home']) {
        const list = (items ?? []).filter((i) => i.person === person && i.category === cat)
        if (list.length) {
          lines.push(`  ${cat}:`)
          for (const it of list) lines.push(`   - ${it.text}`)
        }
      }
      if (!(items ?? []).some((i) => i.person === person)) lines.push('  (nothing yet)')
      lines.push('')
    }

    const when = daysUntil === 0 ? 'today' : 'tomorrow'
    const body = `The Waterloo list changed (you arrive ${when}):\n\n${lines.join('\n')}`

    // --- Send it ---
    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get('GMAIL_USER')!,
          password: Deno.env.get('GMAIL_APP_PASSWORD')!,
        },
      },
    })

    await client.send({
      from: Deno.env.get('GMAIL_USER')!,
      to: s.notify_to,
      subject: 'Waterloo list updated',
      content: body,
    })
    await client.close()

    // --- Record it so the rate limit works ---
    await supabase
      .from('settings')
      .update({
        last_notified_at: new Date().toISOString(),
        notify_count: sentToday + 1,
        notify_count_date: todayStr,
      })
      .eq('id', 1)

    return new Response(`Sent (${sentToday + 1}/${MAX_PER_DAY} today).`, { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(`Error: ${err}`, { status: 500 })
  }
})
