/**
 * This site is a portfolio demo, so it never takes real payments. Checkout only runs when the
 * Stripe secret key is a TEST key (sk_test_...). With a live key (sk_live_...), or no key at all,
 * checkout stays switched off, so a wrong key in the environment can never charge a real card.
 */
export function isStripeTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_')
}
