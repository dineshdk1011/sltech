/**
 * Single source of truth for business identity (NAP) data.
 *
 * Every citation submitted to directories, search engines and social profiles
 * must match these values verbatim. Drift between the phone numbers used in
 * markup, the footer and the contact page undermines local-entity consistency,
 * so they are defined here once and reused everywhere.
 *
 * NOTE: SL Laundry Tech operates TWO numbers on purpose:
 *   - PHONE  -> voice/call number
 *   - WHATSAPP -> chat number
 * Do not merge these. Use each only for its own channel.
 */

export const SITE_URL = 'https://sllaundrytech.com';

export const NAP = {
  name: 'SL Laundry Tech',
  legalName: 'SL Laundry Tech',
  /** Voice / call number, E.164-ish href form. */
  phone: '+91 93616 24107',
  phoneHref: 'tel:+919361624107',
  /** WhatsApp number (separate line, separate purpose). */
  whatsapp: '+91 81100 12041',
  whatsappHref: 'https://wa.me/918110012041',
  email: 'info@sllaundrytech.com',
  streetAddress: 'Palladam',
  addressLocality: 'Palladam',
  addressRegion: 'Tamil Nadu',
  postalCode: '641652',
  addressCountry: 'IN',
} as const;

/**
 * Official brand profiles referenced by `sameAs`.
 *
 * These are the ONLY URLs Google should use to connect the local business
 * entity to its social presence. Listing the homepage here (as was previously
 * the case) tells crawlers nothing.
 *
 * NOTE: the Instagram and Facebook URLs currently point at personal profiles.
 * Once brand pages exist, swap these to the brand handles and the entity
 * association strengthens immediately.
 */
export const SOCIAL_PROFILES = {
  instagram: 'https://www.instagram.com/sanjithloganathan/',
  facebook:
    'https://www.facebook.com/profile.php?id=61593101758218',
  linkedin: 'https://www.linkedin.com/company/143599197',
} as const;

export const sameAsProfiles = [
  SOCIAL_PROFILES.instagram,
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.linkedin,
];

/**
 * Public, indexable routes. Used by `app/sitemap.ts` and the HTML sitemap so
 * the two cannot drift apart.
 *
 * `noindex` routes (auth, dashboards, reports) are deliberately excluded —
 * they should never be submitted to search engines.
 */
export const PUBLIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/brands', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about-us', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/enquiry', priority: 0.6, changeFrequency: 'yearly' },
] as const;

/** Paths that must never be indexed (auth callbacks, dashboards, reports). */
export const PRIVATE_ROUTE_PREFIXES = [
  '/login',
  '/auth',
  '/admin',
  '/enquiry-dashboard',
  '/service-report',
] as const;