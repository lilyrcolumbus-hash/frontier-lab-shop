'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AppearanceFields, type ThemeValues } from '@/components/admin/AppearanceFields'
import { THEME_COLUMNS, type ThemeTokenKey } from '@/lib/theme'

export interface StoreSettings {
  name: string
  supportEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  /** Money is in cents, the unit the checkout and Stripe use. */
  shippingRate: number
  freeShippingThreshold: number
  lowStockThreshold: number
  currency: string
  domain: string
  themeAccent: string
  themeAmber: string
  themeInk: string
  themeInkMuted: string
  themeBg: string
  themeSurface: string
  themeElevated: string
  themeBorder: string
}

const toDollars = (cents: number) => (cents / 100).toFixed(2)
const toCents = (dollars: string) => Math.round((Number(dollars) || 0) * 100)

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [shippingRate, setShippingRate] = useState(toDollars(initial.shippingRate))
  const [threshold, setThreshold] = useState(toDollars(initial.freeShippingThreshold))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  // The picker speaks in tokens ('accent'); the record stores columns ('themeAccent').
  const themeValues = Object.fromEntries(
    Object.entries(THEME_COLUMNS).map(([token, column]) => [token, values[column as keyof StoreSettings] as string])
  ) as ThemeValues

  const updateTheme = (token: ThemeTokenKey, value: string) =>
    setValues((v) => ({ ...v, [THEME_COLUMNS[token]]: value }))

  const thresholdCents = toCents(threshold)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          shippingRate: toCents(shippingRate),
          freeShippingThreshold: thresholdCents,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save the settings')
        return
      }
      setSaved(true)
      router.refresh()
    } catch {
      // A dropped connection rejects the fetch. Without this the button would sit on "Saving…"
      // for ever with nothing explaining why.
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const section = 'bg-surface border border-ds-border rounded-none p-6 space-y-4'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={section}>
        <div>
          <h2 className="text-sm font-medium text-cream">Store details</h2>
          <p className="text-xs text-cream-muted/70 mt-1">
            Used on packing slips and order emails, so customers see the right name and know where
            to reach you.
          </p>
        </div>

        <Input label="Store name" value={values.name} onChange={(e) => update('name', e.target.value)} required />
        <Input
          label="Support email"
          type="email"
          placeholder="you@yourdomain.com"
          value={values.supportEmail}
          onChange={(e) => update('supportEmail', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Address" value={values.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} />
          <Input label="Address line 2" value={values.addressLine2} onChange={(e) => update('addressLine2', e.target.value)} />
          <Input label="City" value={values.city} onChange={(e) => update('city', e.target.value)} />
          <Input label="State / region" value={values.state} onChange={(e) => update('state', e.target.value)} />
          <Input label="Postal code" value={values.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
          <Input label="Country" value={values.country} onChange={(e) => update('country', e.target.value)} />
        </div>
      </div>

      <div className={section}>
        <div>
          <h2 className="text-sm font-medium text-cream">Domain and currency</h2>
          <p className="text-xs text-cream-muted/70 mt-1">
            The domain is used for links in emails, the sitemap and social previews. Pointing it
            at this site is done once in your hosting provider — setting it here does not move it.
          </p>
        </div>

        <Input
          label="Domain"
          value={values.domain}
          onChange={(e) => update('domain', e.target.value.trim().toLowerCase())}
          placeholder="frontierlab.com"
        />

        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Currency</label>
          <select
            value={values.currency}
            onChange={(e) => update('currency', e.target.value)}
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-2.5 text-cream text-sm"
          >
            {['usd', 'eur', 'gbp', 'cad', 'aud', 'mxn'].map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>
          <p className="text-xs text-cream-muted/70 mt-1">
            Charged at checkout. Changing this does not convert your existing prices — the same
            numbers are charged in the new currency.
          </p>
        </div>
      </div>

      <div className={section}>
        <div>
          <h2 className="text-sm font-medium text-cream">Shipping</h2>
          <p className="text-xs text-cream-muted/70 mt-1">
            Applied to every order at checkout. A discount code can never cover shipping — Stripe
            discounts the order subtotal only — so free shipping is granted here.
          </p>
        </div>

        <Input
          label="Shipping rate (USD)"
          type="number"
          min={0}
          step={0.01}
          value={shippingRate}
          onChange={(e) => setShippingRate(e.target.value)}
          required
        />
        <Input
          label="Free shipping over (USD)"
          type="number"
          min={0}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
        <p className="text-xs text-cream-muted/70">
          {thresholdCents > 0
            ? `Orders of $${toDollars(thresholdCents)} or more ship free.`
            : 'Set to 0 to charge shipping on every order.'}
        </p>
        <p className="text-xs text-cream-muted/70">
          This flat rate applies when no shipping zones are defined. Zones, and rates that depend
          on order total or weight, live under Shipping zones.
        </p>
      </div>

      <div className={section}>
        <div>
          <h2 className="text-sm font-medium text-cream">Inventory</h2>
          <p className="text-xs text-cream-muted/70 mt-1">
            Variants at or below this many units are flagged as low on the products list.
          </p>
        </div>
        <Input
          label="Low stock warning at"
          type="number"
          min={0}
          value={values.lowStockThreshold}
          onChange={(e) => update('lowStockThreshold', Number(e.target.value))}
        />
        <p className="text-xs text-cream-muted/70">
          {values.lowStockThreshold > 0 ? 'Set to 0 to turn the warning off.' : 'Warning is off.'}
        </p>
      </div>

      <div className={section}>
        <AppearanceFields values={themeValues} onChange={updateTheme} />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-accent">Settings saved.</p>}

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save settings'}
      </Button>
    </form>
  )
}
