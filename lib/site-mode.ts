import { isStripeLiveMode, isStripeTestMode } from '@/lib/stripe-mode'

/**
 * One codebase, two deployments:
 *  - the real store (myfrontierlab.com): NEXT_PUBLIC_DEMO_MODE unset, Stripe LIVE key;
 *  - the public portfolio demo: NEXT_PUBLIC_DEMO_MODE=true, Stripe TEST key, its own database.
 *
 * The real store has its own, separate switch for "not open for orders yet" (NEXT_PUBLIC_STORE_CLOSED).
 * It must never reuse the demo flag: the demo flag also turns on the one-click demo admin, which must
 * only ever exist on the demo site.
 *
 * NEXT_PUBLIC_ so client components (like the one-click demo admin button) can read it. The value
 * is fixed at build time, so changing it needs a redeploy.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

/** Height in px of the demo banner at the top of every page. The fixed header sits just below it. */
export const DEMO_BANNER_HEIGHT = 32

/**
 * Real store only: set NEXT_PUBLIC_STORE_CLOSED=true to keep checkout closed (and show a slim notice)
 * until the store is ready to take orders. Delete the variable and redeploy to open it. It has no
 * effect on the demo.
 */
export const STORE_CLOSED = !IS_DEMO && process.env.NEXT_PUBLIC_STORE_CLOSED === 'true'

/** True when a slim notice sits above every page (the demo, or the real store while it is closed). */
export const SHOW_TOP_NOTICE = IS_DEMO || STORE_CLOSED

/**
 * Checkout runs only when the Stripe key type matches the deployment: a demo needs a TEST key, the
 * real store needs a LIVE key and must not be marked closed. Any mismatch keeps checkout closed, so a
 * demo can never charge a real card, and a real store with a test key cannot take orders.
 */
export function checkoutAllowed(): boolean {
  if (IS_DEMO) return isStripeTestMode()
  return isStripeLiveMode() && !STORE_CLOSED
}
