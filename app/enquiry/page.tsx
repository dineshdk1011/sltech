import type { Metadata } from 'next';
import Enquiry from '@/components/Enquiry';

export const metadata: Metadata = {
  title: 'Request a Service Enquiry',
  description:
    'Request installation, service, and maintenance support for your commercial laundry equipment with SL Laundry Tech.',
  alternates: {
    canonical: 'https://sllaundrytech.com/enquiry',
  },
  openGraph: {
    title: 'Request a Service Enquiry | SL Laundry Tech',
    description:
      'Request installation, service, and maintenance support for your commercial laundry equipment with SL Laundry Tech.',
    url: 'https://sllaundrytech.com/enquiry',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Service Enquiry | SL Laundry Tech',
    description:
      'Request installation, service, and maintenance support for your commercial laundry equipment with SL Laundry Tech.',
    images: ['/SL-Laundary Banner.png'],
  },
};

const page = () => {
  return <Enquiry />;
};

export default page;