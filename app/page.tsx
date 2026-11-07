import type { Metadata } from 'next';
import Home from '@/components/Home';
import { faqs } from '@/components/site-content';

const description =
  'Commercial laundry machine sales, installation, service, and maintenance for businesses across Tamil Nadu and Kerala. Get expert support from SL Laundry Tech.';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export const metadata: Metadata = {
  // `title.template` in the root layout does NOT apply to a page in the same
  // route segment, so the homepage must set the full title (incl. brand) via
  // `absolute` to reach the recommended 50-60 character length.
  title: {
    absolute: 'Commercial Laundry Machine Experts | SL Laundry Tech',
  },
  description,
  alternates: {
    canonical: 'https://sllaundrytech.com/',
  },
  openGraph: {
    title: 'Commercial Laundry Machine Experts | SL Laundry Tech',
    description,
    url: 'https://sllaundrytech.com/',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Laundry Machine Experts | SL Laundry Tech',
    description,
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Home />
    </>
  );
};

export default page;