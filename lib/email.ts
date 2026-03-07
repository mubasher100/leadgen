import type { } from 'node:events'
import fetch from 'node-fetch'

type LeadPayload = any

export async function sendLeadNotification(lead: LeadPayload) {
  // Prefer SendGrid if API key present
  const sgKey = process.env.SENDGRID_API_KEY
  if (sgKey) {
    const email = lead.email || ''
    const body = {
      personalizations: [ { to: [ { email } ], subject: `New Lead: ${lead?.first_name ?? ''} ${lead?.last_name ?? ''}` } ],
      from: { email: 'noreply@example.com' },
      content: [ { type: 'text/plain', value: `New lead: ${lead?.first_name ?? ''} ${lead?.last_name ?? ''} from ${lead?.company ?? ''}` } ]
    }
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sgKey}`
      },
      body: JSON.stringify(body)
    })
    return
  }
  // Fallback to Mailgun if API key present
  const mgKey = process.env.MAILGUN_API_KEY
  if (mgKey && process.env.MAILGUN_DOMAIN) {
    const url = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`
    const form = new URLSearchParams()
    form.append('from', 'Noreply <noreply@example.com>')
    form.append('to', (process.env.ADMIN_EMAIL || 'owner@example.com'))
    form.append('subject', `New Lead: ${lead?.first_name ?? ''} ${lead?.last_name ?? ''}`)
    form.append('text', `Lead details:\nName: ${lead?.first_name ?? ''} ${lead?.last_name ?? ''}\nEmail: ${lead?.email ?? ''}\nCompany: ${lead?.company ?? ''}`)
.    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('api:' + mgKey).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form
    })
    return
  }
  // No provider configured
  console.log('No email provider configured. Lead notification skipped.')
}
