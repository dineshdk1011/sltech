import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'View our laundry equipment support work and service solutions for commercial laundry operations across India.',
  alternates: {
    canonical: 'https://sllaundrytech.com/gallery',
  },
  openGraph: {
    title: 'Our Work | SL Laundry Tech',
    description:
      'View our laundry equipment support work and service solutions for commercial laundry operations across India.',
    url: 'https://sllaundrytech.com/gallery',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Work | SL Laundry Tech',
    description:
      'View our laundry equipment support work and service solutions for commercial laundry operations across India.',
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return <Gallery />;
};

export default page;