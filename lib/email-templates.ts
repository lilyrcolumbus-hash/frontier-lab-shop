import { prisma } from '@/lib/prisma'

/**
 * Wording for the transactional emails, editable in /admin/emails.
 *
 * Only the words are stored. The layout, the item table and the totals stay in code, so a saved
 * template cannot produce a broken or misleading email — the numbers are never authored by hand.
 */
export const EMAIL_TEMPLATES = [
  {
    key: 'orderConfirmation',
    label: 'Order confirmation',
    description: 'Sent when an order is paid, and whenever you re-send it from the order page.',
    defaults: {
      subjectEn: 'Your {store} order #{number}',
      subjectEs: 'Tu pedido #{number} en {store}',
      headingEn: 'Thank you for your order',
      headingEs: 'Gracias por tu pedido',
      introEn: '',
      introEs: '',
      footerEn: 'Questions about this order? Reply to this email and we will get back to you.',
      footerEs: '¿Dudas sobre tu pedido? Responde a este correo y te contestamos.',
    },
  },
] as const

export type EmailTemplateKey = (typeof EMAIL_TEMPLATES)[number]['key']

export interface ResolvedTemplate {
  subject: string
  heading: string
  intro: string
  footer: string
}

/** Fills {store} and {number} — the only placeholders, so an email cannot reference stray data. */
function fill(text: string, values: { store: string; number: string }): string {
  return text.replace(/\{store\}/g, values.store).replace(/\{number\}/g, values.number)
}

export async function resolveEmailTemplate(
  key: EmailTemplateKey,
  locale: 'en' | 'es',
  values: { store: string; number: string }
): Promise<ResolvedTemplate> {
  const definition = EMAIL_TEMPLATES.find((t) => t.key === key)!
  const d = definition.defaults

  let row: Awaited<ReturnType<typeof prisma.emailTemplate.findFirst>> = null
  try {
    row = await prisma.emailTemplate.findFirst({
      where: { key, store: { slug: process.env.STORE_SLUG ?? 'frontier-lab' } },
    })
  } catch {
    // Fall through to the shipped wording — an email with default text beats no email.
  }

  const pick = (custom: string | undefined, fallback: string) => (custom?.trim() ? custom : fallback)
  const isEs = locale === 'es'

  return {
    subject: fill(pick(isEs ? row?.subjectEs : row?.subjectEn, isEs ? d.subjectEs : d.subjectEn), values),
    heading: fill(pick(isEs ? row?.headingEs : row?.headingEn, isEs ? d.headingEs : d.headingEn), values),
    intro: fill(pick(isEs ? row?.introEs : row?.introEn, isEs ? d.introEs : d.introEn), values),
    footer: fill(pick(isEs ? row?.footerEs : row?.footerEn, isEs ? d.footerEs : d.footerEn), values),
  }
}
