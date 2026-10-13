/**
 * Which kind of Stripe key this deployment has. Whether checkout may run is decided in
 * lib/site-mode.ts, which compares the key type with the deployment mode (demo or real store).
 */
export function isStripeTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_test_')
}

export function isStripeLiveMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_live_')
}
