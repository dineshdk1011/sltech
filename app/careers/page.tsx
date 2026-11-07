import type { Metadata } from 'next'

import Careers from '@/components/Careers'

const description =
  'Build your career with SL Laundry Tech. Explore open positions in commercial laundry service, installation, technical support and operations across India, or submit your resume.'

export const metadata: Metadata = {
  title: 'Careers',
  description,
  alternates: {
    canonical: 'https://sllaundrytech.com/careers',
  },
  openGraph: {
    title: 'Careers | SL Laundry Tech',
    description,
    url: 'https://sllaundrytech.com/careers',
    type: 'website',
    images: [{ url: '/SL-Laundary Banner.png', width: 1200, height: 630, alt: 'SL Laundry Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | SL Laundry Tech',
    description,
    images: ['/SL-Laundary Banner.png'],
  },
}

export default function CareersPage() {
  return <Careers />
}