import { Resend } from 'resend'
import React from 'react'

function getResendClient(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set. Configure it in .env.local to enable email sending.')
  return new Resend(key)
}

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail({
  to,
  subject,
  react,
  from,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
  from?: string
}): Promise<EmailResult> {
  try {
    const client = getResendClient()
    const { data, error } = await client.emails.send({
      from: from ?? process.env.RESEND_FROM_EMAIL ?? 'briefings@paddalaw.ai',
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function sendAlertEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
}): Promise<EmailResult> {
  return sendEmail({
    to,
    subject,
    react,
    from: process.env.RESEND_ALERT_EMAIL ?? 'alerts@paddalaw.ai',
  })
}

// Lazy-proxy resend client — compatible with direct resend.emails.send() usage in cron routes
export const resend = {
  emails: {
    send: (params: Parameters<Resend['emails']['send']>[0]) => getResendClient().emails.send(params),
  },
}
