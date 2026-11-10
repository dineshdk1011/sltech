import type { Metadata } from 'next';
import Link from 'next/link';

import { MACHINE_CATEGORIES, MACHINES } from '@/lib/catalog-data';
import { PUBLIC_ROUTES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Site map for SL Laundry Tech website navigation and service pages.',
  alternates: {
    canonical: 'https://sllaundrytech.com/sitemap',
  },
};

// Human-readable labels keyed by the shared route path, so this page can never
// drift out of sync with `app/sitemap.ts` / `PUBLIC_ROUTES`.
const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/products': 'All Products & OEM Spare Parts',
  ...Object.fromEntries(
    MACHINE_CATEGORIES.map((cat) => [`/products/${cat.id}`, cat.name])
  ),
  ...Object.fromEntries(
    MACHINES.map((m) => [`/products/${m.categoryId}/${m.id}`, `${m.name} (${m.modelCode})`])
  ),
  '/services': 'Services',
  '/brands': 'Brands We Service',
  '/about-us': 'About Us',
  '/contact': 'Contact',
  '/gallery': 'Our Work',
  '/careers': 'Careers',
  '/enquiry': 'Enquire Now',
};

const SitemapPage = () => {
  const midpoint = Math.ceil(PUBLIC_ROUTES.length / 2);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-slate-700">
      <h1 className="text-gradient-brand text-3xl font-extrabold md:text-4xl">Sitemap</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
        All public pages on sllaundrytech.com. The machine-readable version is
        available at <span className="font-semibold">/sitemap.xml</span>.
      </p>
      <div className="mt-6 grid gap-4 text-base md:grid-cols-2">
        <ul className="space-y-3">
          {PUBLIC_ROUTES.slice(0, midpoint).map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="text-[#002B8B] underline"
              >
                {routeLabels[route.path] ?? route.path}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-3">
          {PUBLIC_ROUTES.slice(midpoint).map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="text-[#002B8B] underline"
              >
                {routeLabels[route.path] ?? route.path}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default SitemapPage;
