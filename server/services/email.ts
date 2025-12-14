import { Resend } from 'resend'
import { RESEND_API_KEY, ADMIN_EMAIL } from '../config'

const resend = new Resend(RESEND_API_KEY)

interface LeadAlertData {
  name: string
  email?: string
  phone?: string
  score: number
  urgencyLevel?: number
  mainConcern?: string
  id: string
}

export async function sendLeadAlert(lead: LeadAlertData) {
  if (!RESEND_API_KEY) {
    console.warn('[EmailService] RESEND_API_KEY not configured. Skipping email alert.')
    return
  }

  if (!ADMIN_EMAIL) {
    console.warn('[EmailService] ADMIN_EMAIL not configured. Skipping email alert.')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Psychological Support <onboarding@resend.dev>', // Default Resend testing domain
      to: ADMIN_EMAIL,
      subject: ' Novo Lead Quente: ' + lead.name + ' (Score: ' + lead.score + ')',
      html: '<div><h1>Novo Lead</h1><p>Nome: ' + lead.name + '</p></div>'
    })

    if (error) {
      console.error('[EmailService] Error sending email alert:', error)
      return
    }

    console.info('[EmailService] Email alert sent for lead ' + lead.id)
    return data
  } catch (error) {
    console.error('[EmailService] Unexpected error sending email alert:', error)
  }
}
