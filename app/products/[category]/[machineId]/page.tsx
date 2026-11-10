import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MachineDetailView from '@/components/MachineDetailView';
import { MACHINE_CATEGORIES, MACHINES } from '@/lib/catalog-data';
import { SITE_URL } from '@/lib/site';

interface MachinePageProps {
  params: Promise<{ category: string; machineId: string }>;
}

export function generateStaticParams() {
  return MACHINES.map((machine) => ({
    category: machine.categoryId,
    machineId: machine.id,
  }));
}

export async function generateMetadata({ params }: MachinePageProps): Promise<Metadata> {
  const { category: categoryId, machineId } = await params;
  const category = MACHINE_CATEGORIES.find((c) => c.id === categoryId);
  const machine = MACHINES.find((m) => m.id === machineId && m.categoryId === categoryId);

  if (!category || !machine) {
    return {
      title: 'Machine Not Found',
    };
  }

  const pageUrl = `${SITE_URL}/products/${category.id}/${machine.id}`;
  const description = `${machine.brand} ${machine.name} (${machine.capacityLabel}, Model: ${machine.modelCode}). ${machine.keyFeatures.slice(0, 2).join('. ')}.`;
  const fullTitle = `${machine.name} | SL Laundry Tech`;

  return {
    title: machine.name,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      type: 'website',
      images: [
        {
          url: machine.image,
          width: 1200,
          height: 630,
          alt: machine.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [machine.image],
    },
  };
}

export default async function MachineDetailPage({ params }: MachinePageProps) {
  const { category: categoryId, machineId } = await params;
  const category = MACHINE_CATEGORIES.find((c) => c.id === categoryId);
  const machine = MACHINES.find((m) => m.id === machineId && m.categoryId === categoryId);

  if (!category || !machine) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: machine.name,
    sku: machine.modelCode,
    mpn: machine.modelCode,
    brand: {
      '@type': 'Brand',
      name: machine.brand,
    },
    category: category.name,
    image: `${SITE_URL}${machine.image}`,
    description: `${machine.name} (${machine.capacityLabel}) — ${machine.keyFeatures.join('. ')}`,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${category.id}/${machine.id}`,
      priceCurrency: 'INR',
      availability: machine.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'SL Laundry Tech',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MachineDetailView category={category} machine={machine} />
    </>
  );
}
