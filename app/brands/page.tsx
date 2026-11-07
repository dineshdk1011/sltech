import type { Metadata } from 'next';
import Brands from '@/components/Brands';

export const metadata: Metadata = {
  title: 'Brands We Service',
  description:
    'SL Laundry Tech services leading commercial laundry machine brands with reliable installation, repair, maintenance, and support.',
  alternates: {
    canonical: 'https://sllaundrytech.com/brands',
  },
  openGraph: {
    title: 'Brands We Service | SL Laundry Tech',
    description:
      'SL Laundry Tech services leading commercial laundry machine brands with reliable installation, repair, maintenance, and support.',
    url: 'https://sllaundrytech.com/brands',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brands We Service | SL Laundry Tech',
    description:
      'SL Laundry Tech services leading commercial laundry machine brands with reliable installation, repair, maintenance, and support.',
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return <Brands />;
};

export default page;