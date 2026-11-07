import type { Metadata } from 'next';
import Services from '@/components/Services';
import { services } from '@/components/site-content';
import { SITE_URL } from '@/lib/site';

const description =
  'Explore SL Laundry Tech commercial laundry machine installation, preventive maintenance, breakdown support, AMC, and spare parts services.';

export const metadata: Metadata = {
  title: 'Commercial Laundry Services',
  description,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: 'Commercial Laundry Services | SL Laundry Tech',
    description,
    url: `${SITE_URL}/services`,
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Laundry Services | SL Laundry Tech',
    description,
    images: ['/SL-Laundary Banner.png'],
  },
};

/**
 * Declares each offering as a schema.org Service so search engines can
 * understand the service mix rather than seeing one undifferentiated blob of
 * marketing copy.
 */
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Commercial Laundry Services',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.description,
      provider: {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: 'SL Laundry Tech',
      },
      areaServed: [
        { '@type': 'State', name: 'Tamil Nadu' },
        { '@type': 'State', name: 'Kerala' },
      ],
    },
  })),
};

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Services />
    </>
  );
};

export default page;