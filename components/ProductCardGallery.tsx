'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Camera, Flame } from 'lucide-react';
import { getMachineImages, getMachineViewLabels } from '@/lib/catalog-data';

interface ProductCardGalleryProps {
  images: [string, string, string, string] | string[];
  alt: string;
  href: string;
  categoryId: string;
  heatingType?: string;
  modelCode?: string;
  inStock?: boolean;
}

export default function ProductCardGallery({
  images,
  alt,
  href,
  categoryId,
  heatingType,
  modelCode,
  inStock,
}: ProductCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Guarantee 4 distinct canonical equipment views
  const safeImages: [string, string, string, string] = useMemo(() => {
    const rawImages = Array.isArray(images) && images.length > 0 ? images : undefined;
    return getMachineImages({
      image: rawImages?.[0] || '',
      images: rawImages,
      categoryId,
    });
  }, [images, categoryId]);

  const viewLabels = getMachineViewLabels(categoryId);

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <div
      className="relative mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable Main Image Container */}
      <Link
        href={href}
        className="group/img relative block h-52 w-full rounded-2xl bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300"
      >
        {/* Main Active Image with Smooth Fade */}
        <div className="relative h-full w-full p-3 flex items-center justify-center">
          <Image
            src={safeImages[activeIndex]}
            alt={`${alt} - ${viewLabels[activeIndex] || `View ${activeIndex + 1}`}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 transition-transform duration-300 group-hover/img:scale-105"
          />
        </div>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
          {/* In Stock Badge */}
          {inStock ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
              {modelCode || 'SL-TECH'}
            </span>
          )}

          {/* Photo Counter Pill: 1 / 4 */}
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/75 text-white backdrop-blur-xs shadow-2xs">
            <Camera className="w-2.5 h-2.5 text-blue-300" />
            <span>{activeIndex + 1}/4</span>
          </span>
        </div>

        {/* Bottom Floating Badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
          {/* Heating Type Pill */}
          {heatingType ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs flex items-center gap-1 backdrop-blur-xs">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>{heatingType}</span>
            </span>
          ) : (
            <span />
          )}

          {/* Active View Label Tag */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#002B8B] border border-blue-100 shadow-2xs backdrop-blur-xs truncate max-w-[130px]">
            {viewLabels[activeIndex] || `View ${activeIndex + 1}`}
          </span>
        </div>

        {/* Left & Right Arrow Quick Navigation Buttons */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Previous photo"
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none sm:opacity-0'
          }`}
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Next photo"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none sm:opacity-0'
          }`}
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
      </Link>

      {/* 4 Micro-Thumbnails Selector Strip */}
      <div className="mt-2.5 grid grid-cols-4 gap-1.5 px-0.5">
        {safeImages.map((imgUrl, idx) => {
          const isActive = activeIndex === idx;
          const label = viewLabels[idx] || `View ${idx + 1}`;
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => selectImage(e, idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              title={label}
              className={`group/thumb relative h-11 rounded-lg overflow-hidden border transition-all duration-200 bg-slate-50 flex items-center justify-center p-1 focus:outline-none ${
                isActive
                  ? 'border-[#002B8B] ring-2 ring-[#002B8B]/30 shadow-xs bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
              }`}
            >
              <Image
                src={imgUrl}
                alt={label}
                fill
                sizes="80px"
                className="object-contain p-0.5 transition-transform duration-200 group-hover/thumb:scale-105"
              />
              {/* Active Indicator Underline */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-1 h-0.5 bg-[#002B8B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
