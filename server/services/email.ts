import { Resend } from "resend"
import { ADMIN_EMAIL, DASHBOARD_URL, RESEND_API_KEY } from "../config"

type LeadAlertData = {
  id: string
  conversationId?: string
  name?: string | null
  email?: string | null
  phone?: string | null
  score: number
  urgencyLevel?: number | null
  emotionalState?: 'low' | 'moderate' | 'high' | 'critical' | null
  mainConcern?: string | null
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null
const FROM_EMAIL = "Alertas Psicólogo BH <onboarding@resend.dev>"

const formatValue = (value: string | number | null | undefined, fallback = "Não informado") => {
  if (value === null || value === undefined) return fallback
  if (typeof value === "string" && value.trim().length === 0) return fallback
  return String(value)
}

const getDashboardLink = (lead: LeadAlertData) => {
  const base = DASHBOARD_URL || "http://localhost:5173"
  return lead.conversationId ? `${base}?conversationId=${lead.conversationId}` : base
}

function buildHtmlTemplate(lead: LeadAlertData) {
  const urgencyLabel = lead.emotionalState === "critical" ? "Crítica" : formatValue(lead.urgencyLevel, "Não informado")
  const dashboardLink = getDashboardLink(lead)

  return `
    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 24px;">
      <div style="max-width: 640px; margin: 0 auto; background: linear-gradient(135deg, #111827, #0b1224); border: 1px solid #1f2937; border-radius: 16px; padding: 20px;">
        <p style="margin: 0 0 12px; font-size: 14px; color: #94a3b8;">Alerta automático - Plataforma Beta</p>
        <h1 style="margin: 0 0 8px; font-size: 22px; color: #e2e8f0;">Novo lead prioritário</h1>
        <p style="margin: 0 0 24px; color: #cbd5e1;">Um lead atingiu o limiar de urgência/score. Revise e faça contato rápido.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 16px;">
          <div style="padding: 12px; border-radius: 12px; background: #111827; border: 1px solid #1f2937;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Score</p>
            <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700; color: #22c55e;">${lead.score}</p>
          </div>
          <div style="padding: 12px; border-radius: 12px; background: #111827; border: 1px solid #1f2937;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Urgência</p>
            <p style="margin: 4px 0 0; font-size: 18px; font-weight: 600; color: #f97316;">${urgencyLabel}</p>
          </div>
          <div style="padding: 12px; border-radius: 12px; background: #111827; border: 1px solid #1f2937;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">Contato</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #e2e8f0; line-height: 1.5;">
              Email: ${formatValue(lead.email)}<br/>
              Telefone: ${formatValue(lead.phone)}
            </p>
          </div>
        </div>

        <div style="padding: 12px; border-radius: 12px; background: #0f172a; border: 1px solid #1f2937; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Resumo</p>
          <p style="margin: 6px 0 0; font-size: 14px; color: #e2e8f0; line-height: 1.6;">
            Nome: <strong>${formatValue(lead.name, "Lead sem nome")}</strong><br/>
            Motivo: ${formatValue(lead.mainConcern)}
          </p>
        </div>

        <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(90deg, #22c55e, #16a34a); color: #0b1224; text-decoration: none; font-weight: 700; padding: 12px 18px; border-radius: 12px;">Abrir no dashboard</a>

        <p style="margin: 20px 0 0; font-size: 12px; color: #64748b;">Se o link não funcionar, copie e cole esta URL no navegador: ${dashboardLink}</p>
      </div>
    </div>
  `
}

function buildTextTemplate(lead: LeadAlertData) {
  const dashboardLink = getDashboardLink(lead)

  return [
    "Novo lead prioritário",
    `Nome: ${formatValue(lead.name, "Lead sem nome")}`,
    `Score: ${lead.score}`,
    `Urgência: ${lead.emotionalState === "critical" ? "Crítica" : formatValue(lead.urgencyLevel)}`,
    `Motivo: ${formatValue(lead.mainConcern)}`,
    `Email: ${formatValue(lead.email)}`,
    `Telefone: ${formatValue(lead.phone)}`,
    `Dashboard: ${dashboardLink}`,
  ].join("\n")
}

export async function sendLeadAlert(lead: LeadAlertData) {
  if (!RESEND_API_KEY || !resend) {
    console.warn('[EmailService] RESEND_API_KEY não configurada. Ignorando envio de alerta.')
    return
  }

  if (!ADMIN_EMAIL) {
    console.warn('[EmailService] ADMIN_EMAIL não configurado. Ignorando envio de alerta.')
    return
  }

  const recipients = ADMIN_EMAIL.split(',').map(email => email.trim()).filter(Boolean)
  if (recipients.length === 0) {
    console.warn('[EmailService] ADMIN_EMAIL vazio. Ignorando envio de alerta.')
    return
  }

  const subject = `Novo lead prioritário: ${formatValue(lead.name, 'Lead sem nome')} (Score ${lead.score})`

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject,
      html: buildHtmlTemplate(lead),
      text: buildTextTemplate(lead),
    })

    if (error) {
      console.error('[EmailService] Erro ao enviar alerta de lead:', error)
      return
    }

    console.info('[EmailService] Alerta de lead enviado para', recipients.join(','))
  } catch (error) {
    console.error('[EmailService] Erro inesperado ao enviar alerta de lead:', error)
  }
}
