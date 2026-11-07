import type { Metadata } from 'next';
import About_Us from '@/components/About-us';

export const metadata: Metadata = {
  title: 'About Us | Commercial Laundry Experts',
  description:
    'Learn about SL Laundry Tech and our commercial laundry maintenance, installation, and equipment support services for businesses across India.',
  alternates: {
    canonical: 'https://sllaundrytech.com/about-us',
  },
  openGraph: {
    title: 'About SL Laundry Tech',
    description:
      'Learn about SL Laundry Tech and our commercial laundry maintenance, installation, and equipment support services for businesses across India.',
    url: 'https://sllaundrytech.com/about-us',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SL Laundry Tech',
    description:
      'Learn about SL Laundry Tech and our commercial laundry maintenance, installation, and equipment support services for businesses across India.',
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return <About_Us />;
};

export default page;