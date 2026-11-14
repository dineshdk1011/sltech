'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Flame,
  Check,
  ShieldCheck,
  Camera,
  Layers,
} from 'lucide-react';
import { getMachineImages, getMachineViewLabels } from '@/lib/catalog-data';

interface MachineDetailGalleryProps {
  images: [string, string, string, string] | string[];
  name: string;
  modelCode: string;
  categoryId: string;
  heatingType?: string;
  inStock?: boolean;
  warrantyYears?: number;
}

export default function MachineDetailGallery({
  images,
  name,
  modelCode,
  categoryId,
  heatingType,
  inStock,
  warrantyYears,
}: MachineDetailGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Guarantee 4 distinct canonical equipment views for this machine line
  const safeImages: [string, string, string, string] = useMemo(() => {
    const rawImages = Array.isArray(images) && images.length > 0 ? images : undefined;
    return getMachineImages({
      image: rawImages?.[0] || '',
      images: rawImages,
      categoryId,
    });
  }, [images, categoryId]);

  const viewLabels = useMemo(() => getMachineViewLabels(categoryId), [categoryId]);

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    },
    [safeImages.length]
  );

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    },
    [safeImages.length]
  );

  const selectImage = useCallback((index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(index);
  }, []);

  // Keyboard navigation (arrows navigate photos, Escape closes lightbox)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, prevImage, nextImage]);

  return (
    <div className="space-y-3">
      {/* 1. MAIN LARGE HERO IMAGE SHOWCASE */}
      <div
        className="group relative h-80 sm:h-96 lg:h-[440px] w-full rounded-3xl bg-gradient-to-b from-[#F9FBFE] via-white to-[#EEF5FD] border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Photo Click to Open Lightbox */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-full w-full p-6 sm:p-8 flex items-center justify-center cursor-zoom-in focus:outline-none"
          title="Click to view full screen"
        >
          <Image
            src={safeImages[activeIndex]}
            alt={`${name} - ${viewLabels[activeIndex] || `Angle ${activeIndex + 1}`}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-white/95 text-slate-800 border border-slate-200 shadow-2xs">
              {modelCode}
            </span>
            {inStock && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                In Stock
              </span>
            )}
            {warrantyYears && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#002B8B] border border-blue-100 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#002B8B]" />
                <span>{warrantyYears}Y Warranty</span>
              </span>
            )}
          </div>

          {/* Fullscreen Expand Action Button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Expand image to full screen"
            className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm hover:shadow transition-all hover:border-[#002B8B]"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#002B8B]" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none gap-2">
          {heatingType ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 border border-slate-200 flex items-center gap-1.5 shadow-2xs backdrop-blur-xs">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{heatingType} Heating</span>
            </span>
          ) : (
            <span />
          )}

          {/* Active View Label & Counter (matching home page camera pill) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 text-white text-xs font-bold backdrop-blur-xs shadow-md">
            <Camera className="w-3.5 h-3.5 text-blue-300" />
            <span>
              {activeIndex + 1}/4: {viewLabels[activeIndex]}
            </span>
          </div>
        </div>

        {/* Quick Nav Arrows with hover transitions (Home page behavior) */}
        <button
          type="button"
          onClick={(e) => prevImage(e)}
          aria-label="Previous view angle"
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-85 sm:opacity-0 sm:scale-95'
          } hover:scale-105`}
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        <button
          type="button"
          onClick={(e) => nextImage(e)}
          aria-label="Next view angle"
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-85 sm:opacity-0 sm:scale-95'
          } hover:scale-105`}
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* 2. 4 INTERACTIVE THUMBNAILS BAR (Matches Home Page Hover + Click Feature) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-1">
          <span className="inline-flex items-center gap-1 text-[#002B8B] font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>4 Angle Views Available:</span>
          </span>
          <span className="text-slate-400">Hover or click to switch view</span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {safeImages.map((imgUrl, idx) => {
            const isActive = activeIndex === idx;
            const label = viewLabels[idx] || `Angle ${idx + 1}`;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => selectImage(idx, e)}
                onMouseEnter={() => selectImage(idx)}
                title={`Switch to ${label}`}
                className={`group/thumb relative flex flex-col items-center rounded-2xl p-1.5 sm:p-2 border transition-all duration-200 text-left bg-white focus:outline-none cursor-pointer ${
                  isActive
                    ? 'border-[#002B8B] ring-2 ring-[#002B8B]/30 shadow-md bg-blue-50/40'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Thumbnail Image Box */}
                <div className="relative h-14 sm:h-18 w-full rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Image
                    src={imgUrl}
                    alt={label}
                    fill
                    sizes="160px"
                    className="object-contain p-1 group-hover/thumb:scale-105 transition-transform duration-200"
                  />
                  {/* Photo Index Micro Pill */}
                  <span className="absolute top-1 left-1 text-[8px] font-bold px-1 rounded bg-black/60 text-white">
                    {idx + 1}
                  </span>
                </div>

                {/* View Label & Angle Caption */}
                <div className="mt-1.5 w-full text-center px-0.5">
                  <span
                    className={`block text-[10px] sm:text-xs font-black truncate leading-tight ${
                      isActive ? 'text-[#002B8B]' : 'text-slate-700 group-hover/thumb:text-[#002B8B]'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="block text-[9px] font-semibold text-slate-400 mt-0.5">
                    Angle {idx + 1}
                  </span>
                </div>

                {/* Active Indicator Underline Bar */}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-3 h-1 bg-[#002B8B] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LIGHTBOX FULLSCREEN MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6"
        >
          {/* Header Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white py-2">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-100">{name}</h4>
              <p className="text-xs text-blue-300">
                Photo {activeIndex + 1} of 4 — {viewLabels[activeIndex]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen modal"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Large Image Area with Prev/Next Controls */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4">
            <div className="relative w-full h-full max-h-[75vh]">
              <Image
                src={safeImages[activeIndex]}
                alt={`${name} - ${viewLabels[activeIndex]}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={(e) => prevImage(e)}
              aria-label="Previous image"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => nextImage(e)}
              aria-label="Next image"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Thumbnail Strip */}
          <div className="w-full max-w-2xl flex items-center justify-center gap-3 py-2">
            {safeImages.map((imgUrl, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => selectImage(idx, e)}
                  onMouseEnter={() => selectImage(idx)}
                  className={`relative h-14 w-20 rounded-xl overflow-hidden border-2 transition-all bg-white/10 cursor-pointer ${
                    isActive
                      ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={viewLabels[idx]}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
