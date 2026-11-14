'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Package,
  Phone,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { MACHINE_CATEGORIES, MACHINES, SPARE_PARTS } from '@/lib/catalog-data';
import { useCart } from './CartContext';
import CategoryCardGallery from './CategoryCardGallery';

export default function Home() {
  const { openDrawer } = useCart();

  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation for Hero and Machine Cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5 }
      )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.65 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-desc',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(
          '.gsap-hero-actions',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.25'
        )
        .fromTo(
          '.gsap-hero-contacts',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.2'
        )
        .fromTo(
          '.gsap-hero-trust-item',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 },
          '-=0.2'
        );

      // Staggered reveal for the 6 machine cards
      gsap.fromTo(
        '.gsap-machine-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.25,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-16 pb-16 pt-2">
      {/* 1. HERO SECTION - CLEAN, SPACIOUS, AUTHORITATIVE */}
      <section className="relative isolate overflow-hidden rounded-[32px] border border-[#DCEBFA] bg-gradient-to-br from-white via-[#F7FAFE] to-[#EAF4FD] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 shadow-[0_20px_50px_rgba(0,43,139,0.06)] text-center">
        {/* Subtle background glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#1268D8]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#002B8B]/8 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#002B8B_1px,transparent_1px),linear-gradient(90deg,#002B8B_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="gsap-hero-badge inline-flex items-center gap-2 rounded-full border border-[#CCE0F5] bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#002B8B] shadow-xs backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authorized Dealership &amp; Engineering Support</span>
          </div>

          {/* Main Title */}
          <h1 className="gsap-hero-title text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
            Commercial Laundry Machinery <br />
            <span className="bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] bg-clip-text text-transparent">
              &amp; Genuine Spare Parts
            </span>
          </h1>

          {/* Description */}
          <p className="gsap-hero-desc text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Sales, turnkey installation, genuine OEM replacement parts, and certified AMC maintenance for{' '}
            <strong className="text-slate-900 font-bold">6 commercial machine types</strong>. Authorized dealers for{' '}
            <strong className="text-[#002B8B]">Danube</strong>,{' '}
            <strong className="text-[#002B8B]">Speed Queen</strong>, and{' '}
            <strong className="text-[#002B8B]">LG Commercial</strong> across Tamil Nadu, Kerala &amp; Pan-India.
          </p>

          {/* Quick Action Buttons */}
          <div className="gsap-hero-actions flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#machines-section"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] hover:brightness-105 text-white font-bold px-7 py-3.5 text-sm shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore 6 Machine Types</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={openDrawer}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#0753B8]/25 bg-white hover:bg-blue-50/50 text-[#002B8B] font-bold px-6 py-3.5 text-sm shadow-xs transition-all cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#1268D8]" />
              <span>Instant Quotation Basket</span>
            </button>
          </div>

          {/* Quick Contact & Verified Hotlines */}
          <div className="gsap-hero-contacts flex flex-wrap items-center justify-center gap-6 pt-2 text-xs sm:text-sm text-slate-600 font-semibold">
            <a
              href="tel:+919361624107"
              className="flex items-center gap-2 hover:text-[#002B8B] transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-blue-100/80 text-[#002B8B] flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span>Hotline: +91 93616 24107</span>
            </a>

            <a
              href="https://wa.me/918110012041?text=Hello%20SL%20Laundry%20Tech,%20I%20am%20looking%20for%20commercial%20laundry%20machines%20and%20spare%20parts."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <Image src="/WA.png" alt="WhatsApp" width={16} height={16} />
              </div>
              <span>WhatsApp: +91 81100 12041</span>
            </a>
          </div>

          {/* Trust Badges in a clean row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-200/60 max-w-2xl mx-auto">
            <div className="gsap-hero-trust-item flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>15-Min Quote SLA</span>
            </div>
            <div className="gsap-hero-trust-item flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Genuine OEM Spares</span>
            </div>
            <div className="gsap-hero-trust-item flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>2-Year Factory Warranty</span>
            </div>
            <div className="gsap-hero-trust-item flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Pan-India Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND LOGOS STRIP */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Authorized Dealerships &amp; Global Commercial Makes:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-90">
          <div className="h-7 w-24 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/Danube-Logo.png" alt="Danube" fill className="object-contain" />
          </div>
          <div className="h-7 w-28 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/Speed Queen.png" alt="Speed Queen" fill className="object-contain" />
          </div>
          <div className="h-7 w-16 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/LG-WS.png" alt="LG Commercial" fill className="object-contain" />
          </div>
          <div className="h-7 w-20 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/Girbau-WM.png" alt="Girbau" fill className="object-contain" />
          </div>
          <div className="h-7 w-24 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/Electrolux.png" alt="Electrolux" fill className="object-contain" />
          </div>
          <div className="h-7 w-20 relative grayscale hover:grayscale-0 transition-all hover:scale-105">
            <Image src="/DOMUS-Logo.png" alt="DOMUS" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* 3. THE 6 COMMERCIAL MACHINERY LINES (SIMPLE, BEAUTIFUL, POWERFUL) */}
      <section id="machines-section" className="scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#002B8B] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Our 6 Machinery Lines
          </span>
          <h2 className="mt-3 text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Choose a Machine Type to View Brands &amp; Sizes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Click on any machine category below to open its dedicated catalog page — filter models by{' '}
            <strong className="text-slate-900">Brand</strong>,{' '}
            <strong className="text-slate-900">Capacity Size</strong>, and view all compatible genuine spare parts.
          </p>
          <div className="mt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:underline"
            >
              <span>Or browse all 6 lines &amp; spare parts finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Cards Grid (GSAP Animated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MACHINE_CATEGORIES.map((cat, idx) => {
            const catMachines = MACHINES.filter((m) => m.categoryId === cat.id);
            const catPartsCount = SPARE_PARTS.filter((p) =>
              p.applicableCategoryIds.includes(cat.id)
            ).length;
            const brandNames = Array.from(new Set(catMachines.map((m) => m.brand))).join(', ');

            return (
              <div
                key={cat.id}
                className="gsap-machine-card group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm hover:border-[#002B8B]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-slate-400 font-bold text-[11px]">
                    0{idx + 1} {'//'}
                  </span>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002B8B] border border-blue-100">
                    {cat.capacityRange}
                  </span>
                </div>

                {/* 4-Image Machine Line Gallery */}
                <CategoryCardGallery
                  images={cat.images}
                  name={cat.name}
                  badge={cat.badge}
                  modelCount={catMachines.length}
                  categoryId={cat.id}
                />

                <Link href={`/products/${cat.id}`} className="block focus-visible:outline-none">
                  {/* Title & Tagline */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#002B8B] transition-colors mt-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>

                  <div className="mt-2 text-[11px] text-slate-600 font-medium">
                    <span className="text-slate-400">Available Brands:</span>{' '}
                    <strong className="text-slate-800">{brandNames}</strong>
                  </div>

                  {/* Highlight Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                    {cat.features.slice(0, 2).map((feat, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-600 truncate max-w-full"
                      >
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </span>
                    ))}
                  </div>
                </Link>

                {/* View Action Links */}
                <div className="mt-5 space-y-2">
                  <Link
                    href={`/products/${cat.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-[#002B8B] text-white font-bold text-xs transition-colors shadow-sm group-hover:shadow-md"
                  >
                    <span>View Models, Brands &amp; Sizes</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href={`/products/${cat.id}?tab=parts`}
                    className="block w-full text-center text-[11px] font-semibold text-slate-500 hover:text-[#002B8B] transition-colors py-1"
                  >
                    View Compatible Spare Parts ({catPartsCount})
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. GENUINE SPARE PARTS SUMMARY */}
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              100% Genuine OEM Sourced
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Over 100+ Commercial Parts In Stock
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Need Replacement Spare Parts for Any Brand?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Inverter frequency drives (VFDs), 3-inch motorized drain valves, water solenoids, heavy-duty bearings, Viton seals, silicone door gaskets, Incoloy heating elements, and Nomex ironing ribbons ready for 24-48h dispatch.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            href="/products?tab=parts"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#002B8B] hover:bg-[#001f66] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/20"
          >
            <Package className="w-4 h-4 text-cyan-300" />
            <span>Browse Spare Parts</span>
          </Link>
          <Link
            href="/enquiry"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all"
          >
            <span>Enquire Now</span>
          </Link>
          <a
            href="tel:+919361624107"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all"
          >
            <Phone className="w-4 h-4 text-[#002B8B]" />
            <span>Call Hotline</span>
          </a>
        </div>
      </section>

      {/* 5. WHY CHOOSE SL LAUNDRY TECH (4 SIMPLE PILLARS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Businesses Choose SL Laundry Tech
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Consistent technical support, genuine parts, and quick field response.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Authorized Dealership',
              desc: 'Official partner for Danube, Speed Queen, and LG Commercial equipment with factory warranty.',
              icon: BadgeCheck,
            },
            {
              title: 'Genuine OEM Parts',
              desc: 'Specification-correct authentic spare parts to extend machine lifespan and prevent failure.',
              icon: Wrench,
            },
            {
              title: 'Fast Breakdown Response',
              desc: 'Prioritized emergency breakdown visits with sub-15 minute initial quotation and call response.',
              icon: Clock,
            },
            {
              title: 'Pan-India Reach & AMC',
              desc: 'Tailored Annual Maintenance Contracts, machine installation and relocation across India.',
              icon: ShieldCheck,
            },
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#002B8B] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CLEAN BOTTOM ENQUIRY CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] text-white p-8 sm:p-12 text-center space-y-4 shadow-xl shadow-blue-900/20">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Ready to Configure Your Commercial Laundry Setup?
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-100">
          Share your daily load or machinery requirement. Our senior laundry engineers will send an itemized quotation within 15 minutes.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#002B8B] text-xs font-black transition-all shadow-md"
          >
            <span>Request Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="tel:+919361624107"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <Phone className="w-4 h-4 text-cyan-300" />
            <span>Call +91 93616 24107</span>
          </a>
        </div>
      </section>
    </div>
  );
}