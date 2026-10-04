/**
 * Public credentials for the read-only portfolio demo of /admin.
 *
 * Anyone may sign in with this account and look at every admin screen. It can never write:
 * withStoreAdmin refuses every non-GET request from it, and it never sees customer data
 * (orders, customers, staff emails, gift-card codes). The password is public on purpose, so it
 * protects nothing and must never be reused anywhere.
 */
export const DEMO_ADMIN_EMAIL = 'demo@myfrontierlab.com'
export const DEMO_ADMIN_PASSWORD = 'FrontierDemo-2026'
