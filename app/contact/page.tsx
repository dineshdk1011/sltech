import type { Metadata } from 'next';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact SL Laundry Tech',
  description:
    'Contact SL Laundry Tech for commercial laundry machine service, installation, maintenance, and support across Tamil Nadu and Kerala.',
  alternates: {
    canonical: 'https://sllaundrytech.com/contact',
  },
  openGraph: {
    title: 'Contact SL Laundry Tech',
    description:
      'Contact SL Laundry Tech for commercial laundry machine service, installation, maintenance, and support across Tamil Nadu and Kerala.',
    url: 'https://sllaundrytech.com/contact',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SL Laundry Tech',
    description:
      'Contact SL Laundry Tech for commercial laundry machine service, installation, maintenance, and support across Tamil Nadu and Kerala.',
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return <Contact />;
};

export default page;