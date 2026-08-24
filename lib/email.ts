import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Frontier Lab <onboarding@resend.dev>'

export const emailConfigured = Boolean(resend)

async function sendEmail(to: string, subject: string, html: string, context: string) {
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipping ${context} email to`, to)
    return
  }

  const { error } = await resend.emails.send({ from: FROM, to, subject, html })

  if (error) {
    console.error(`Resend failed to send ${context} email to`, to, error)
  }
}

function emailShell(heading: string, body: string, ctaLabel: string, ctaUrl: string, footer: string) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 22px; color: #1C2018;">${heading}</h1>
      <p style="color: #566458; line-height: 1.6;">${body}</p>
      <a href="${ctaUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 28px; background: #3D6E45; color: #F8F9F8; text-decoration: none; border-radius: 999px; font-weight: 600;">${ctaLabel}</a>
      <p style="color: #566458; font-size: 13px;">${footer}</p>
    </div>
  `
}

export async function sendVerificationEmail(to: string, verifyUrl: string, locale: 'en' | 'es') {
  const subject = locale === 'es' ? 'Verifica tu correo — Frontier Lab' : 'Verify your email — Frontier Lab'
  const html = emailShell(
    locale === 'es' ? 'Verifica tu correo' : 'Verify your email',
    locale === 'es' ? 'Confirma tu correo para activar tu cuenta de Frontier Lab.' : 'Confirm your email to activate your Frontier Lab account.',
    locale === 'es' ? 'Verificar correo' : 'Verify email',
    verifyUrl,
    locale === 'es' ? 'Este enlace vence en 24 horas.' : 'This link expires in 24 hours.'
  )
  await sendEmail(to, subject, html, 'verification')
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, locale: 'en' | 'es') {
  const subject = locale === 'es' ? 'Restablece tu contraseña — Frontier Lab' : 'Reset your password — Frontier Lab'
  const html = emailShell(
    locale === 'es' ? 'Restablece tu contraseña' : 'Reset your password',
    locale === 'es'
      ? 'Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste vos, ignora este correo.'
      : "We received a request to reset your account's password. If this wasn't you, ignore this email.",
    locale === 'es' ? 'Restablecer contraseña' : 'Reset password',
    resetUrl,
    locale === 'es' ? 'Este enlace vence en 1 hora.' : 'This link expires in 1 hour.'
  )
  await sendEmail(to, subject, html, 'password reset')
}
