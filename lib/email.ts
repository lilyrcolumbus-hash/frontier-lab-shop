import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Frontier Lab <onboarding@resend.dev>'

export const emailConfigured = Boolean(resend)

export async function sendVerificationEmail(to: string, verifyUrl: string, locale: 'en' | 'es') {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping verification email to', to)
    return
  }

  const subject = locale === 'es' ? 'Verifica tu correo — Frontier Lab' : 'Verify your email — Frontier Lab'
  const heading = locale === 'es' ? 'Verifica tu correo' : 'Verify your email'
  const body =
    locale === 'es'
      ? 'Confirma tu correo para activar tu cuenta de Frontier Lab.'
      : 'Confirm your email to activate your Frontier Lab account.'
  const cta = locale === 'es' ? 'Verificar correo' : 'Verify email'
  const expires = locale === 'es' ? 'Este enlace vence en 24 horas.' : 'This link expires in 24 hours.'

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 22px; color: #1C2018;">${heading}</h1>
        <p style="color: #566458; line-height: 1.6;">${body}</p>
        <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 28px; background: #3D6E45; color: #F8F9F8; text-decoration: none; border-radius: 999px; font-weight: 600;">${cta}</a>
        <p style="color: #566458; font-size: 13px;">${expires}</p>
      </div>
    `,
  })
}
