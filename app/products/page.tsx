import { Suspense } from 'react';
import type { Metadata } from 'next';
import MachinePartsHub from '@/components/MachinePartsHub';
import Loader from '@/components/Loader';
import { MACHINE_CATEGORIES } from '@/lib/catalog-data';
import { SITE_URL } from '@/lib/site';

const description =
  'Browse commercial washer extractors, tumble dryers, flatwork ironers, hydro extractors, barrier washers, steam presses, and 100+ genuine OEM laundry spare parts.';

export const metadata: Metadata = {
  title: 'Commercial Laundry Products & OEM Spare Parts',
  description,
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: 'Commercial Laundry Products & OEM Spare Parts | SL Laundry Tech',
    description,
    url: `${SITE_URL}/products`,
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech Products' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Laundry Products & OEM Spare Parts | SL Laundry Tech',
    description,
    images: ['/SL-Laundary Banner.png'],
  },
};

const catalogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Commercial Laundry Machinery Lines',
  itemListElement: MACHINE_CATEGORIES.map((cat, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    url: `${SITE_URL}/products/${cat.id}`,
    name: cat.name,
  })),
};

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogJsonLd) }}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[45vh] items-center justify-center py-12">
            <Loader label="Loading machinery and spare parts catalog..." />
          </div>
        }
      >
        <MachinePartsHub />
      </Suspense>
    </>
  );
}
