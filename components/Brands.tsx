'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

type BrandStatus = 'authorized' | 'serviced';

interface BrandItem {
  name: string;
  asset: string;
  status: BrandStatus;
  country: string;
  specialty: string;
  categories: string[];
}

const brandsList: BrandItem[] = [
  {
    name: 'Danube International',
    asset: 'Danube-Logo',
    status: 'authorized',
    country: 'France / Spain',
    specialty: 'Barrier washers, high-spin washer extractors & flatwork ironers',
    categories: ['Washers', 'Dryers', 'Barrier', 'Ironers'],
  },
  {
    name: 'Speed Queen (Alliance)',
    asset: 'Speed Queen',
    status: 'authorized',
    country: 'USA',
    specialty: 'Heavy commercial on-premise & vended washer-extractors & dryers',
    categories: ['Washers', 'Dryers', 'OPL'],
  },
  {
    name: 'LG Commercial Laundry',
    asset: 'LG-WS',
    status: 'authorized',
    country: 'South Korea',
    specialty: 'Direct drive inverter commercial washers & stack tumble dryers',
    categories: ['Washers', 'Dryers', 'Laundromats'],
  },
  {
    name: 'DOMUS Laundry',
    asset: 'DOMUS-Logo',
    status: 'serviced',
    country: 'Spain',
    specialty: 'Industrial sanitary barrier washers & eco-energy drying tumblers',
    categories: ['Washers', 'Dryers', 'Ironers'],
  },
  {
    name: 'Electrolux Professional',
    asset: 'Electrolux',
    status: 'serviced',
    country: 'Sweden',
    specialty: 'High-performance commercial washer extractors & drying systems',
    categories: ['Washers', 'Dryers', 'Finishing'],
  },
  {
    name: 'Girbau Industrial',
    asset: 'Girbau-WM',
    status: 'serviced',
    country: 'Spain',
    specialty: 'Heavy-duty industrial washing systems & continuous batch plants',
    categories: ['Washers', 'Dryers', 'Ironers'],
  },
  {
    name: 'Primus Laundry',
    asset: 'Primus',
    status: 'serviced',
    country: 'Belgium',
    specialty: 'Commercial & hospitality hygienic barrier washers & extractors',
    categories: ['Washers', 'Dryers', 'Hygiene'],
  },
  {
    name: 'IFB Commercial',
    asset: 'IFB-Logo',
    status: 'serviced',
    country: 'India',
    specialty: 'Commercial laundry machines & dry cleaning finishing systems',
    categories: ['Washers', 'Dryers', 'Finishing'],
  },
  {
    name: 'LaundryPro',
    asset: 'LJ-Logo',
    status: 'serviced',
    country: 'International',
    specialty: 'Commercial laundry equipment & automatic folding machines',
    categories: ['Washers', 'Dryers', 'Ironers'],
  },
  {
    name: 'Milnor',
    asset: 'Milnor-Logo',
    status: 'serviced',
    country: 'USA',
    specialty: 'Continuous tunnel batch washers & heavy industrial extractors',
    categories: ['Tunnel Washers', 'Extractors'],
  },
  {
    name: 'Fagor Industrial',
    asset: 'Fagor-Logo',
    status: 'serviced',
    country: 'Spain',
    specialty: 'Professional commercial washers, dryers & drying ironers',
    categories: ['Washers', 'Dryers', 'Ironers'],
  },
  {
    name: 'Kannegiesser',
    asset: 'Kannegaiser-Logo',
    status: 'serviced',
    country: 'Germany',
    specialty: 'Industrial tunnel batch washers, automated feeders & folders',
    categories: ['Automation', 'Feeders', 'Ironers'],
  },
];

export default function Brands() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-brand-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-12 pb-16 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
            Global Partnerships &amp; Multi-Brand Service
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Machinery Brands We Service &amp; Supply
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
          <ShieldCheck className="w-4 h-4" />
          <span>Danube · Speed Queen · LG Commercial</span>
        </div>
      </div>

      {/* AUTHORIZED DEALERSHIP SPOTLIGHT */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
            Official Commercial Partnerships
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Authorized Sales &amp; Warranty Service
          </h2>
          <p className="text-sm text-slate-600">
            Backed directly by manufacturer warranties, factory-trained engineering personnel, and immediate OEM spare parts allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Danube */}
          <div className="relative rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1">
                <BadgeCheck className="w-4 h-4" />
                Authorized Dealer
              </span>
              <span className="text-xs text-slate-400 font-bold">France / Spain</span>
            </div>

            <div className="h-16 flex items-center mb-5">
              <Image
                src="/Danube-Logo.png"
                alt="Danube International"
                width={160}
                height={50}
                className="h-11 w-auto object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Danube International
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              World leader in heavy industrial washer-extractors (11–120 kg), sanitary barrier medical machines, and energy-efficient flatwork ironers.
            </p>

            <Link
              href="/products?brand=Danube"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#002B8B] hover:text-[#1268D8] transition-colors"
            >
              <span>Explore Danube Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. Speed Queen */}
          <div className="relative rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1">
                <BadgeCheck className="w-4 h-4" />
                Authorized Dealer
              </span>
              <span className="text-xs text-slate-400 font-bold">Alliance · USA</span>
            </div>

            <div className="h-16 flex items-center mb-5">
              <Image
                src="/Speed Queen.png"
                alt="Speed Queen"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Speed Queen Commercial
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Legendary durability from Alliance Laundry Systems. Built for high-frequency daily operation in hotel laundries, institutions, and vended plants.
            </p>

            <Link
              href="/products?brand=Speed%20Queen"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#002B8B] hover:text-[#1268D8] transition-colors"
            >
              <span>Explore Speed Queen Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3. LG Commercial */}
          <div className="relative rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-white to-emerald-50/20 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black px-3 py-1">
                <BadgeCheck className="w-4 h-4" />
                Authorized Dealer
              </span>
              <span className="text-xs text-slate-400 font-bold">South Korea</span>
            </div>

            <div className="h-16 flex items-center mb-5">
              <Image
                src="/LG-WS.png"
                alt="LG Commercial Laundry"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              LG Commercial Laundry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Industry-standard Inverter Direct Drive technology offering ultra-low water usage, quiet operation, and modular stack washer-dryer configurations.
            </p>

            <Link
              href="/products?brand=LG%20Commercial"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#002B8B] hover:text-[#1268D8] transition-colors"
            >
              <span>Explore LG Equipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. COMPLETE MULTI-BRAND PORTFOLIO (12 LOGO CARDS)
      ========================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Multi-Brand Service &amp; Spares
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Supported Machinery Brands &amp; Components
          </h2>
          <p className="text-sm text-slate-600">
            We provide precision maintenance, diagnostic testing, motor rewinds, and replacement spares for all premier manufacturers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {brandsList.map((brand) => {
            const isAuthorized = brand.status === 'authorized';

            return (
              <div
                key={brand.name}
                className="gsap-brand-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_6px_25px_rgba(0,43,139,0.03)] hover:shadow-[0_16px_35px_rgba(0,43,139,0.1)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                      isAuthorized
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-[#002B8B] border border-blue-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAuthorized ? 'bg-emerald-500' : 'bg-[#002B8B]'
                      }`}
                    />
                    {isAuthorized ? 'Authorized Dealer' : 'Service & AMC'}
                  </span>

                  <span className="text-[10px] text-slate-400 font-semibold truncate">
                    {brand.country}
                  </span>
                </div>

                {/* Brand Logo Container */}
                <div className="h-18 flex items-center justify-center p-2 mb-3 bg-slate-50/70 rounded-xl group-hover:bg-white transition-colors">
                  <Image
                    src={`/${brand.asset}.png`}
                    alt={brand.name}
                    width={140}
                    height={45}
                    className="max-h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Brand Info */}
                <div className="space-y-1.5 mb-4">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#002B8B] transition-colors">
                    {brand.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    {brand.specialty}
                  </p>
                </div>

                {/* Machine Category Tags */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                  {brand.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          4. CAN'T FIND YOUR BRAND? - HIGH CONVERTING CTA
      ========================================================= */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-[#CCE0F5] bg-gradient-to-r from-[#F7FBFF] via-white to-[#EDF5FD] p-8 sm:p-10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#002B8B]">
              Custom Engineering &amp; Sourcing
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              Have an Existing Machine Not Listed Here?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We service and supply compatible replacement bearings, seals, drain valves, solenoids, and VFDs for virtually any industrial European, American, or Asian laundry machine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] text-white font-bold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:brightness-105 transition-all"
            >
              <span>Contact Service Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/918110012041?text=Hi%20SL%20Laundry%20Tech,%20I%20have%20a%20machine%20model%20and%20need%20spare%20parts/service."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3.5 transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Send Nameplate Photo</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}