'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BrandItem {
  name: string;
  logo?: string;
}

interface CardBrandScrollerProps {
  categoryId: string;
  categoryName: string;
  brands: BrandItem[];
}

export default function CardBrandScroller({
  categoryId,
  categoryName,
  brands,
}: CardBrandScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [brands]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = direction === 'left' ? -130 : 130;
    el.scrollBy({ left: distance, behavior: 'smooth' });
  };

  if (!brands || brands.length === 0) return null;

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-100/90">
      <div className="flex items-center justify-between text-[11px] mb-1.5 px-0.5">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#002B8B]" />
          Available Brands ({brands.length})
        </span>

        {/* Mini Scroll Controls */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label={`Scroll brands left for ${categoryName}`}
            className="p-0.5 rounded-md hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label={`Scroll brands right for ${categoryName}`}
            className="p-0.5 rounded-md hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
      >
        {brands.map((b) => (
          <Link
            key={b.name}
            href={`/products/${categoryId}?brand=${encodeURIComponent(b.name)}`}
            title={`View ${b.name} ${categoryName}`}
            className="inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg bg-slate-50/90 hover:bg-blue-50 border border-slate-200/80 hover:border-[#002B8B]/40 hover:-translate-y-0.5 transition-all text-slate-700 hover:text-[#002B8B] shadow-2xs group/brand focus-visible:outline-none"
          >
            {b.logo && (
              <div className="relative w-5 h-3.5 shrink-0">
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
            )}
            <span className="whitespace-nowrap text-[11px] font-semibold group-hover/brand:font-bold">
              {b.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
