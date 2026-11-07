'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowRight, Package, Phone, Sparkles } from 'lucide-react';
import { useCart } from './CartContext';

export default function FloatingEnquiryDock() {
  const { items, openDrawer } = useCart();
  const dockRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef<number>(items.length);

  useEffect(() => {
    if (items.length !== prevCount.current && dockRef.current) {
      gsap.fromTo(
        dockRef.current,
        { scale: 0.82, rotate: -2 },
        { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1.1, 0.45)' }
      );
      prevCount.current = items.length;
    }
  }, [items.length]);

  return (
    <div ref={dockRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Quick WhatsApp / Phone floats if no items */}
      {items.length === 0 ? (
        <div className="flex items-center gap-2">
          <a
            href="tel:+919361624107"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#002B8B] shadow-lg border border-slate-200 hover:scale-105 transition-transform"
            title="Call Senior Technician"
          >
            <Phone className="w-5 h-5" />
          </a>

          <a
            href="https://wa.me/918110012041?text=Hello%20SL%20Laundry%20Tech,%20I%20am%20looking%20for%20commercial%20laundry%20machines%20and%20spare%20parts."
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:scale-105 transition-transform"
            title="Chat on WhatsApp"
          >
            <Image src="/WA.png" alt="WhatsApp" width={24} height={24} />
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Main Selected Items Floating Pill */}
          <button
            onClick={openDrawer}
            className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] px-4 py-3 text-white shadow-2xl shadow-blue-900/40 hover:-translate-y-0.5 hover:shadow-blue-900/60 transition-all cursor-pointer border border-white/20"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs">
              <Package className="w-4 h-4 text-white" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white ring-2 ring-white">
                {items.length}
              </span>
            </span>

            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-wider text-cyan-200">
                Enquiry Basket
              </div>
              <div className="text-sm font-extrabold text-white">
                {items.length} Item{items.length > 1 ? 's' : ''} Selected
              </div>
            </div>

            <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white group-hover:text-[#002B8B] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
