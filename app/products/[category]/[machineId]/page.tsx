import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MachineDetailView from '@/components/MachineDetailView';
import { MACHINE_CATEGORIES, MACHINES, getMachineImages } from '@/lib/catalog-data';
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

  const machineImages = getMachineImages(machine);

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
      images: machineImages.map((img, i) => ({
        url: img,
        width: 1200,
        height: 896,
        alt: `${machine.name} - View ${i + 1}`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: machineImages,
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

  const machineImages = getMachineImages(machine);

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
    image: machineImages.map((img) => `${SITE_URL}${img}`),
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
