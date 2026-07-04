import { createLogger } from '@temp-repo/logger'
import { renderMagicLinkEmail } from './magic-link-email'

const logger = createLogger('email')

/**
 * Deliver a magic-link email via Resend when `RESEND_API_KEY` is set; otherwise
 * log the link to the console (dev fallback).
 */
export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string
  url: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? 'Studio <onboarding@resend.dev>'

  if (!apiKey) {
    logger.info(`\n✨ Magic Link for ${email}:\n${url}\n`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Your Studio sign-in link',
      html: renderMagicLinkEmail(url),
    }),
  })
  if (!res.ok) {
    logger.error({ status: res.status, body: await res.text() }, 'Resend send failed')
  }
}
