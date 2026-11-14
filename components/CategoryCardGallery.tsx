'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Camera, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { getMachineImages, getMachineViewLabels } from '@/lib/catalog-data';

interface CategoryCardGalleryProps {
  images: [string, string, string, string] | string[];
  name: string;
  badge: string;
  modelCount: number;
  categoryId: string;
  imageHeight?: string;
  showFullscreen?: boolean;
}

export default function CategoryCardGallery({
  images,
  name,
  badge,
  modelCount,
  categoryId,
  imageHeight = 'h-52',
  showFullscreen = true,
}: CategoryCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Guarantee 4 distinct canonical equipment views
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

  const selectImage = useCallback((e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, prevImage, nextImage]);

  return (
    <div
      className="relative mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image View */}
      <div
        className={`relative ${imageHeight} w-full rounded-2xl bg-gradient-to-b from-[#F9FBFE] to-[#EEF5FD] overflow-hidden flex items-center justify-center p-3 border border-slate-100 group/cat`}
      >
        <button
          type="button"
          onClick={() => showFullscreen && setIsLightboxOpen(true)}
          className={`relative h-full w-full flex items-center justify-center focus:outline-none ${
            showFullscreen ? 'cursor-zoom-in' : 'cursor-default'
          }`}
          title={showFullscreen ? 'Click to view full screen' : undefined}
        >
          <Image
            src={safeImages[activeIndex]}
            alt={`${name} - ${viewLabels[activeIndex] || `View ${activeIndex + 1}`}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 group-hover/cat:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
          {/* Photo Index Counter */}
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs shadow-2xs">
            <Camera className="w-2.5 h-2.5 text-blue-300" />
            <span>{activeIndex + 1}/4</span>
          </span>

          <div className="flex items-center gap-1.5">
            {modelCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#002B8B] shadow-2xs border border-blue-100">
                {modelCount} Models
              </span>
            )}
            {showFullscreen && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                aria-label="Expand image to fullscreen"
                className="pointer-events-auto p-1 rounded-md bg-white/90 hover:bg-white text-slate-700 shadow-2xs border border-slate-200 transition-all hover:text-[#002B8B] cursor-pointer"
                title="Fullscreen view"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
          {badge ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-2xs border border-slate-100">
              {badge}
            </span>
          ) : (
            <span />
          )}

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#002B8B] shadow-2xs border border-blue-100 backdrop-blur-xs truncate max-w-[150px]">
            {viewLabels[activeIndex]}
          </span>
        </div>

        {/* Quick Nav Arrows */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Previous view angle"
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-85 sm:opacity-0 sm:scale-95'
          } hover:scale-105`}
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Next view angle"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all duration-200 z-10 cursor-pointer ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-85 sm:opacity-0 sm:scale-95'
          } hover:scale-105`}
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* 4 Micro Thumbnails Bar with Hover Preview & Active Indicator */}
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
              title={`Switch to ${label}`}
              className={`group/thumb relative h-11 sm:h-12 rounded-lg overflow-hidden border transition-all duration-200 bg-slate-50 focus:outline-none cursor-pointer flex items-center justify-center p-0.5 ${
                isActive
                  ? 'border-[#002B8B] ring-2 ring-[#002B8B]/30 shadow-xs bg-blue-50/40'
                  : 'border-slate-200 hover:border-blue-300 opacity-80 hover:opacity-100'
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
                <span className="absolute bottom-0 inset-x-1.5 h-0.5 bg-[#002B8B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Modal */}
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
                  onClick={(e) => selectImage(e, idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
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
