import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductCategoryView from '@/components/ProductCategoryView';
import Loader from '@/components/Loader';
import { MACHINE_CATEGORIES, MACHINES } from '@/lib/catalog-data';
import { SITE_URL } from '@/lib/site';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return MACHINE_CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = MACHINE_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    return {
      title: 'Product Category Not Found',
    };
  }

  const pageUrl = `${SITE_URL}/products/${category.id}`;
  const fullTitle = `${category.name} | SL Laundry Tech`;

  return {
    title: category.name,
    description: category.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description: category.description,
      url: pageUrl,
      type: 'website',
      images: category.images.map((img, i) => ({
        url: img,
        width: 1200,
        height: 896,
        alt: `${category.name} - View ${i + 1}`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: category.description,
      images: category.images,
    },
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = MACHINE_CATEGORIES.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  const categoryMachines = MACHINES.filter((m) => m.categoryId === category.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/products/${category.id}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryMachines.map((machine, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/products/${category.id}/${machine.id}`,
        name: machine.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[45vh] items-center justify-center py-12">
            <Loader label={`Loading ${category.shortName}...`} />
          </div>
        }
      >
        <ProductCategoryView category={category} />
      </Suspense>
    </>
  );
}
