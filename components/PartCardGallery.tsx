'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { PART_VIEW_LABELS, getPartImages } from '@/lib/catalog-data';

interface PartCardGalleryProps {
  images: [string, string, string, string] | string[];
  name: string;
  partNumber: string;
  category: string;
}

export default function PartCardGallery({
  images,
  name,
  partNumber,
  category,
}: PartCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const safeImages: [string, string, string, string] = useMemo(() => {
    const rawImages = Array.isArray(images) && images.length > 0 ? images : undefined;
    return getPartImages({
      image: rawImages?.[0] || '',
      images: rawImages,
      category,
    });
  }, [images, category]);

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

  const viewLabels = PART_VIEW_LABELS;

  return (
    <div
      className="relative mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Frame */}
      <div className="relative h-44 w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 overflow-hidden border border-slate-100 flex items-center justify-center p-2 group/part">
        <Image
          src={safeImages[activeIndex]}
          alt={`${name} - ${viewLabels[activeIndex] || `Angle ${activeIndex + 1}`}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover/part:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-2xs border border-slate-200/60">
            {partNumber}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
            <Camera className="w-2.5 h-2.5 text-emerald-400" />
            <span>{activeIndex + 1}/4</span>
          </span>
        </div>

        {/* Bottom Category Tag */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs truncate max-w-[140px]">
            {category}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/95 text-emerald-800 shadow-2xs border border-emerald-100 backdrop-blur-xs">
            {viewLabels[activeIndex]}
          </span>
        </div>

        {/* Arrow Controls */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Previous part view"
          className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-opacity z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Next part view"
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-opacity z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Micro Thumbnails */}
      <div className="mt-2 grid grid-cols-4 gap-1.5">
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
              className={`relative h-10 rounded-lg overflow-hidden border transition-all duration-200 bg-slate-50 focus:outline-none ${
                isActive
                  ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
              }`}
            >
              <Image
                src={imgUrl}
                alt={label}
                fill
                sizes="60px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
