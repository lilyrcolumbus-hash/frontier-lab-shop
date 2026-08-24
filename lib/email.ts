import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.RESEND_FROM_EMAIL ?? 'Frontier Lab <onboarding@resend.dev>'

export const emailConfigured = Boolean(resend)

// Real approved logo (~/Desktop/Frontier Lab Logo/palette-amber-dark.png), resized for email
// and hosted as a static asset — base64-embedded images get stripped by some mail clients'
// security filters (data: URIs), so a plain https URL is more broadly compatible for email.
const SITE_ORIGIN = 'https://shrooms-lilyrcolumbus-hashs-projects.vercel.app'
const LOGO_URL = SITE_ORIGIN + '/images/email/logo.png'

// Verified real photo (Blue Oyster cluster) — same one used in the site's own Hero/Encyclopedia,
// per the project's photo-verification policy. Loaded remotely (fine for a decorative hero image;
// unlike the logo it's not identity-critical if a client blocks it).
const HERO_IMAGE = 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=960&h=420&q=80&auto=format&fit=crop'

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

// Table-based layout for cross-client compatibility (Outlook desktop still renders on Word's
// engine — it ignores border-radius/flex but degrades gracefully to square corners).
function emailShell(opts: {
  eyebrow: string
  heading: string
  body: string
  ctaLabel: string
  ctaUrl: string
  footer: string
  disclaimer: string
}) {
  const { eyebrow, heading, body, ctaLabel, ctaUrl, footer, disclaimer } = opts

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<title>${heading}</title>
</head>
<body style="margin:0; padding:0; background-color:#F0F2F0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F2F0; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#F8F9F8; border-radius:20px; border:1px solid #D2D8D2; overflow:hidden;">

          <!-- Hero photo -->
          <tr>
            <td style="line-height:0;">
              <img src="${HERO_IMAGE}" width="480" alt="Blue Oyster mushroom cluster" style="display:block; width:100%; max-width:480px; height:180px; object-fit:cover; background-color:#0A1A0F;" />
            </td>
          </tr>

          <!-- Wordmark, overlapping the photo edge -->
          <tr>
            <td align="center" style="padding:24px 32px 0; background-color:#F8F9F8;">
              <img src="${LOGO_URL}" width="200" alt="Frontier Lab" style="display:block; width:200px; height:auto;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:14px 32px 0;">
              <div style="width:36px; height:2px; background-color:#9E6820;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:28px 40px 8px;">
              <p style="margin:0 0 10px; font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace; font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#3D6E45;">${eyebrow}</p>
              <h1 style="margin:0 0 14px; font-size:24px; line-height:1.3; font-weight:700; color:#1C2018;">${heading}</h1>
              <p style="margin:0; font-size:15px; line-height:1.65; color:#566458;">${body}</p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:28px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:999px; background-color:#3D6E45;">
                    <a href="${ctaUrl}" style="display:inline-block; padding:14px 36px; font-size:15px; font-weight:600; color:#F8F9F8; text-decoration:none; border-radius:999px;">${ctaLabel}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:0 40px 28px;">
              <p style="margin:0; font-size:12px; line-height:1.6; color:#566458;">
                ${footer}<br />
                <a href="${ctaUrl}" style="color:#3D6E45; word-break:break-all;">${ctaUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px; border-top:1px solid #D2D8D2;">
              <p style="margin:16px 0 0; font-size:12px; line-height:1.6; color:#566458;">${disclaimer}</p>
              <p style="margin:12px 0 0; font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:#8A9FAE;">Wild Genetics. Lab Verified.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendVerificationEmail(to: string, verifyUrl: string, locale: 'en' | 'es') {
  const subject = locale === 'es' ? 'Verifica tu correo — Frontier Lab' : 'Verify your email — Frontier Lab'
  const html = emailShell({
    eyebrow: locale === 'es' ? 'Verificación de cuenta' : 'Account verification',
    heading: locale === 'es' ? 'Verifica tu correo' : 'Verify your email',
    body:
      locale === 'es'
        ? 'Un último paso para activar tu cuenta de Frontier Lab — confirmá que este correo es tuyo.'
        : "One last step to activate your Frontier Lab account — let's confirm this email is yours.",
    ctaLabel: locale === 'es' ? 'Verificar correo' : 'Verify email',
    ctaUrl: verifyUrl,
    footer: locale === 'es' ? 'O copiá y pegá este enlace en tu navegador:' : 'Or copy and paste this link into your browser:',
    disclaimer:
      locale === 'es'
        ? 'Este enlace vence en 24 horas. Si no creaste esta cuenta, podés ignorar este correo.'
        : "This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.",
  })
  await sendEmail(to, subject, html, 'verification')
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, locale: 'en' | 'es') {
  const subject = locale === 'es' ? 'Restablece tu contraseña — Frontier Lab' : 'Reset your password — Frontier Lab'
  const html = emailShell({
    eyebrow: locale === 'es' ? 'Seguridad de la cuenta' : 'Account security',
    heading: locale === 'es' ? 'Restablece tu contraseña' : 'Reset your password',
    body:
      locale === 'es'
        ? 'Recibimos una solicitud para restablecer la contraseña de tu cuenta de Frontier Lab.'
        : "We received a request to reset your Frontier Lab account's password.",
    ctaLabel: locale === 'es' ? 'Restablecer contraseña' : 'Reset password',
    ctaUrl: resetUrl,
    footer: locale === 'es' ? 'O copiá y pegá este enlace en tu navegador:' : 'Or copy and paste this link into your browser:',
    disclaimer:
      locale === 'es'
        ? 'Este enlace vence en 1 hora. Si no fuiste vos, podés ignorar este correo — tu contraseña no va a cambiar.'
        : "This link expires in 1 hour. If this wasn't you, you can safely ignore this email — your password won't change.",
  })
  await sendEmail(to, subject, html, 'password reset')
}
