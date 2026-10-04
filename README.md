# Frontier Lab

**Live:** [myfrontierlab.com](https://myfrontierlab.com) (also at [shrooms-five.vercel.app](https://shrooms-five.vercel.app))

> **Portfolio demo mode.** Checkout is disabled server-side: Stripe is still wired to a real,
> live-mode account, but no orders are processed. The rest of the site, including real prices
> and the admin panel's read path, works as built.

A bilingual (EN/ES) premium mushroom cultivation e-commerce and education platform: a 28-product
catalog (liquid culture, grain spawn, bulk substrate, fruiting blocks), an 8-species encyclopedia,
a grow-tools suite (substrate calculator, grow journal, species finder), and a self-service admin
panel the owner runs the whole business from — no developer in the loop for day-to-day changes.

## Admin panel

**Try it:** open [myfrontierlab.com/account](https://myfrontierlab.com/account), use the public demo account shown on
that page, then go to `/admin`. The demo account is read-only (every write is refused by the server) and
customer data is hidden from it.

Everything a merchant needs to run the store day to day, without touching code: orders (tracking,
partial fulfillment, printable packing slips, refunds/cancellations wired to real Stripe
refunds), products (bulk edit, CSV import/export, SEO fields, image galleries with per-photo alt
text), customers (synthesized from order history, segments, lifetime value), analytics
(period-over-period comparison, CSV export), discounts and gift cards (backed by real Stripe
coupons/promotion codes), shipping zones and tax rates, owner/staff roles enforced at three
layers (UI, API, and Postgres row-level security), a block-based page builder, and a blog with
scheduled publishing. Every one of these shipped after being exercised with real clicks against
the real database — not just a compiling build — including the failure paths (a dropped network
request while saving, an invalid value, a cancelled confirmation).

**The same admin engine also runs as its own standalone repo** —
[frontier-lab-admin](https://github.com/lilyrcolumbus-hash/frontier-lab-admin), a from-scratch
rebuild of this admin on a different stack (Cloudflare Worker + Supabase with Postgres RLS as the
real access boundary, no service-role key anywhere) — real evidence the admin layer generalizes
as a reusable engine rather than being wired one-off into a single storefront.

## What's real vs. what's honestly aspirational

No invented metrics: the numbers on the site come from real systems (the catalog and the
encyclopedia). The photo gallery shows species photos only, with no made-up customer names; some
of the photos are stock images.

## Tech stack

- Next.js 14 (App Router), TypeScript (strict), Tailwind CSS
- Prisma + Postgres (Supabase-hosted)
- Supabase Auth (session-based, `@supabase/ssr`)
- Stripe — Checkout, webhooks, refunds, coupons/promotion codes, tax rates (all live-mode)
- Resend for transactional email
- next-intl for EN/ES routing and content
- An MCP server (`/api/mcp`) exposing the catalog, orders, customers and discounts to AI clients
  via a self-hosted OAuth 2.1 (PKCE) flow — no third-party auth provider

## Running locally

```bash
npx next dev       # https://localhost:3000
npx tsc --noEmit    # type check
```

Needs a Postgres database (`DATABASE_URL`/`DIRECT_URL`), a Supabase project (Auth + Storage), and
Stripe/Resend test-mode keys — see `.env.example`.
