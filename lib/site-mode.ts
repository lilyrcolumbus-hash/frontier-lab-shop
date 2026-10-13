import { isStripeLiveMode, isStripeTestMode } from '@/lib/stripe-mode'

/**
 * One codebase, two deployments:
 *  - the real store (myfrontierlab.com): NEXT_PUBLIC_DEMO_MODE unset, Stripe LIVE key;
 *  - the public portfolio demo: NEXT_PUBLIC_DEMO_MODE=true, Stripe TEST key, its own database.
 *
 * NEXT_PUBLIC_ so client components (like the one-click demo admin button) can read it. The value
 * is fixed at build time, so changing it needs a redeploy.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

/**
 * Checkout runs only when the Stripe key type matches the deployment: a demo needs a TEST key, the
 * real store needs a LIVE key. Any mismatch keeps checkout closed, so a demo can never charge a real
 * card, and a real store with a test key (or a live key while still in demo mode) cannot take orders.
 */
export function checkoutAllowed(): boolean {
  return IS_DEMO ? isStripeTestMode() : isStripeLiveMode()
}
