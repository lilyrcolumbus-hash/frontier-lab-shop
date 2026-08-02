'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type Lang = 'en' | 'es'

const COPY = {
  en: {
    name: 'Your name',
    email: 'Email',
    product: 'Which product? (optional)',
    productPlaceholder: 'e.g. Lion\'s Mane Liquid Culture',
    rating: 'Your rating',
    comment: 'Your review',
    commentPlaceholder: 'How did your grow go? What did you like — or what should we improve?',
    submit: 'Submit review & get my code',
    submitting: 'Submitting…',
    error: 'Something went wrong — please try again, or email lyhoffllc.info@gmail.com.',
    successTitle: 'Thank you!',
    successBody: 'Use this code at checkout for 15% off your next order:',
    copy: 'Copy code',
    copied: 'Copied',
    howTo: 'Enter it in the "Promo code" field on the Stripe checkout page.',
  },
  es: {
    name: 'Tu nombre',
    email: 'Correo',
    product: '¿Qué producto? (opcional)',
    productPlaceholder: 'ej. Cultivo Líquido de Lion\'s Mane',
    rating: 'Tu calificación',
    comment: 'Tu reseña',
    commentPlaceholder: '¿Cómo te fue con el cultivo? ¿Qué te gustó, o qué deberíamos mejorar?',
    submit: 'Enviar reseña y obtener mi código',
    submitting: 'Enviando…',
    error: 'Algo salió mal — intenta de nuevo, o escríbenos a lyhoffllc.info@gmail.com.',
    successTitle: '¡Gracias!',
    successBody: 'Usa este código al pagar para obtener 15% de descuento en tu próximo pedido:',
    copy: 'Copiar código',
    copied: 'Copiado',
    howTo: 'Ingrésalo en el campo "Promo code" de la página de pago de Stripe.',
  },
}

export function ReviewForm({ locale, initialProduct }: { locale: Lang; initialProduct?: string }) {
  const t = COPY[locale]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [productName, setProductName] = useState(initialProduct ?? '')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1) return
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, comment, productName: productName || undefined, locale }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setCode(data.code)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'success') {
    return (
      <div className="bg-accent/8 border border-accent/25 rounded-2xl p-8 text-center">
        <p className="font-body font-bold text-xl text-cream mb-2">{t.successTitle}</p>
        <p className="text-cream-muted mb-6">{t.successBody}</p>
        <div className="inline-flex items-center gap-3 bg-surface border border-ds-border rounded-xl px-6 py-4">
          <span className="font-mono text-2xl font-bold text-accent tracking-widest">{code}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-sm font-mono uppercase tracking-wider text-cream-muted hover:text-cream transition-colors"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="text-cream-muted text-sm mt-6">{t.howTo}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label={t.name} value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        label={t.product}
        placeholder={t.productPlaceholder}
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">{t.rating}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              className="p-1"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={n <= (hoverRating || rating) ? '#9E6820' : 'none'}
                stroke="#9E6820"
                strokeWidth="1.5"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-cream-muted mb-1.5">
          {t.comment}
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
          required
          minLength={10}
          rows={5}
          className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream placeholder:text-cream-muted/60 font-body text-base transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
        />
      </div>

      {status === 'error' && <p className="text-error text-sm">{t.error}</p>}

      <Button type="submit" isLoading={status === 'loading'} disabled={rating < 1} fullWidth>
        {status === 'loading' ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
