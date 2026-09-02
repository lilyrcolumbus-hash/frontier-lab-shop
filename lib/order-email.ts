import { Resend } from 'resend'
import { formatPrice } from '@/lib/utils'
import { SITE_URL } from '@/lib/site-url'
import { resolveEmailTemplate, type ResolvedTemplate } from '@/lib/email-templates'

interface OrderEmailLine {
  name: string
  quantity: number
  price: number
}

export interface OrderEmailInput {
  orderId: string
  email: string
  createdAt: Date
  subtotal: number
  shipping: number
  tax: number
  total: number
  trackingNumber: string | null
  shippingName: string
  shippingLine1: string
  shippingLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  items: OrderEmailLine[]
  storeName: string
  /** Empty when the owner has not set one — the footer line is then left out entirely. */
  supportEmail: string
  /** Which language the buyer saw at checkout. */
  locale?: 'en' | 'es'
}

/** Escapes values that reach the HTML body — order data is customer-supplied text. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(order: OrderEmailInput, copy: ResolvedTemplate): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #D2D8D2;color:#1C2018;font-size:14px;">
          ${escapeHtml(item.name)}<span style="color:#566458;"> × ${item.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #D2D8D2;color:#1C2018;font-size:14px;text-align:right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('')

  const totalRow = (label: string, value: string, bold = false) => `
      <tr>
        <td style="padding:4px 0;color:${bold ? '#1C2018' : '#566458'};font-size:14px;${bold ? 'font-weight:700;' : ''}">${label}</td>
        <td style="padding:4px 0;color:${bold ? '#1C2018' : '#566458'};font-size:14px;text-align:right;${bold ? 'font-weight:700;' : ''}">${value}</td>
      </tr>`

  // Deliberately a text bar rather than an image: an email filtered to spam has its images
  // blocked, and the brand still has to be readable when that happens.
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F0F2F0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0F2F0;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F8F9F8;border:1px solid #D2D8D2;">
        <tr><td style="background:#1C2018;padding:20px 24px;">
          <div style="color:#F4F1EA;font-size:18px;letter-spacing:0.18em;font-weight:700;">${escapeHtml(order.storeName.toUpperCase())}</div>
          <div style="color:#9E6820;font-size:11px;letter-spacing:0.22em;margin-top:6px;text-transform:uppercase;">Wild Genetics. Lab Verified.</div>
        </td></tr>

        <tr><td style="padding:28px 24px 8px;">
          <h1 style="margin:0 0 6px;font-size:20px;color:#1C2018;">${escapeHtml(copy.heading)}</h1>
          <p style="margin:0;color:#566458;font-size:14px;">
            Order #${escapeHtml(order.orderId.slice(-8))} · ${order.createdAt.toDateString()}
          </p>
          ${copy.intro ? `<p style="margin:12px 0 0;color:#566458;font-size:14px;line-height:1.6;">${escapeHtml(copy.intro)}</p>` : ''}
        </td></tr>

        <tr><td style="padding:16px 24px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>

        <tr><td style="padding:14px 24px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${totalRow('Subtotal', formatPrice(order.subtotal))}
            ${totalRow('Shipping', order.shipping === 0 ? 'Free' : formatPrice(order.shipping))}
            ${order.tax > 0 ? totalRow('Tax', formatPrice(order.tax)) : ''}
            ${totalRow('Total', formatPrice(order.total), true)}
          </table>
        </td></tr>

        <tr><td style="padding:24px;">
          <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;color:#566458;">Shipping to</p>
          <p style="margin:0;color:#1C2018;font-size:14px;line-height:1.5;">
            ${escapeHtml(order.shippingName)}<br/>
            ${escapeHtml(order.shippingLine1)}<br/>
            ${order.shippingLine2 ? `${escapeHtml(order.shippingLine2)}<br/>` : ''}
            ${escapeHtml(order.shippingCity)}, ${escapeHtml(order.shippingState)} ${escapeHtml(order.shippingPostalCode)}<br/>
            ${escapeHtml(order.shippingCountry)}
          </p>
          ${
            order.trackingNumber
              ? `<p style="margin:14px 0 0;color:#1C2018;font-size:14px;">Tracking number: <strong>${escapeHtml(order.trackingNumber)}</strong></p>`
              : ''
          }
        </td></tr>

        <tr><td style="padding:0 24px 28px;">
          <a href="${SITE_URL}/account/orders" style="display:inline-block;padding:12px 20px;background:#1C2018;color:#F4F1EA;text-decoration:none;font-size:14px;">View your orders</a>
        </td></tr>

        <tr><td style="background:#E8ECEA;padding:16px 24px;color:#566458;font-size:12px;line-height:1.6;">
          ${escapeHtml(copy.footer)}${order.supportEmail ? ` ${escapeHtml(order.supportEmail)}` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function buildText(order: OrderEmailInput, copy: ResolvedTemplate): string {
  const lines = order.items.map((i) => `- ${i.name} x ${i.quantity}  ${formatPrice(i.price * i.quantity)}`).join('\n')
  return [
    copy.heading,
    `Order #${order.orderId.slice(-8)} · ${order.createdAt.toDateString()}`,
    '',
    lines,
    '',
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}`,
    `Total: ${formatPrice(order.total)}`,
    '',
    `Shipping to: ${order.shippingName}, ${order.shippingLine1}, ${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}, ${order.shippingCountry}`,
    order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : '',
    '',
    `${SITE_URL}/account/orders`,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Sends the order confirmation.
 *
 * Returns a result instead of throwing so a caller in the Stripe webhook can log a failure
 * without losing the order — the payment already happened, and an email is re-sendable from
 * the admin. Resend reports errors in its response body rather than by throwing, so the
 * `error` field has to be checked explicitly.
 */
export async function sendOrderConfirmation(
  order: OrderEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    return { ok: false, error: 'Email is not configured (RESEND_API_KEY / RESEND_FROM_EMAIL).' }
  }

  try {
    const copy = await resolveEmailTemplate('orderConfirmation', order.locale ?? 'en', {
      store: order.storeName,
      number: order.orderId.slice(-8),
    })

    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: order.email,
      subject: copy.subject,
      html: buildHtml(order, copy),
      text: buildText(order, copy),
    })
    if (error) {
      console.error('[order-email] Resend rejected the message', error)
      return { ok: false, error: error.message ?? 'The email provider rejected the message.' }
    }
    return { ok: true }
  } catch (err) {
    console.error('[order-email] send failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Could not send the email.' }
  }
}
