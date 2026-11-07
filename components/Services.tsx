'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  HeartPulse,
  Hotel,
  HousePlus,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Settings,
  ShieldCheck,
  Shirt,
  Siren,
  Sparkles,
  ToolCase,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react';
import { useCart } from './CartContext';

interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  highlights: string[];
  sla: string;
}

const servicesData: ServiceDetail[] = [
  {
    id: 'installation',
    title: 'Machine Installation & Commissioning',
    tagline: 'Precision mechanical, steam, water & electrical alignment',
    description:
      'Turnkey installation for industrial washer extractors, barrier washers, tumble dryers, and flatwork ironers. We handle utility load balancing, foundation leveling, anchoring, and certified startup testing.',
    badge: 'Turnkey Setup',
    icon: HousePlus,
    highlights: [
      'G-Factor foundation & vibration dampening',
      'Steam, 3-phase electric & gas line calibration',
      'Digital PLC cycle programming & staff training',
      'Pre-commissioning water hardness check',
    ],
    sla: 'Certified Startup Handover',
  },
  {
    id: 'amc',
    title: 'Annual Maintenance Contracts (AMC)',
    tagline: 'Scheduled preventive servicing to ensure zero downtime',
    description:
      'Customized comprehensive and non-comprehensive AMC agreements. Includes regular lubrication, motor bearing diagnostics, VFD frequency inspection, solenoid health checks, and priority breakdown callouts.',
    badge: '99.2% Uptime Guarantee',
    icon: CalendarCheck,
    highlights: [
      'Scheduled bi-monthly / monthly preventive audits',
      'Thermal imaging inspection for VFD & control panels',
      'Free software calibration & drum balance tuning',
      'Priority spare parts dispatch with SLA discount',
    ],
    sla: '24/7 Priority Emergency Hotline',
  },
  {
    id: 'breakdown',
    title: 'Rapid Breakdown Assistance',
    tagline: 'Rapid response engineers dispatched across TN & Kerala',
    description:
      'When an industrial machine halts, every hour costs money. Our mobile senior engineers carry diagnostic equipment and critical OEM replacement parts directly to your hotel, hospital, or commercial laundry facility.',
    badge: 'Rapid Response Dispatch',
    icon: Siren,
    highlights: [
      'Dedicated emergency engineering helpline',
      'On-site diagnostic analysis for drive & inverter errors',
      'Motor rewinding & mechanical seal replacement',
      'Emergency loaner spares for critical components',
    ],
    sla: '< 24hr On-Site SLA in Major Hubs',
  },
  {
    id: 'spare-parts',
    title: 'Genuine OEM Spare Parts Supply',
    tagline: '100% authentic components for Danube, Speed Queen, LG & more',
    description:
      'We warehouse and supply certified original manufacturer components. From high-frequency inverter drives to motorized drain valves, heavy-duty door gaskets, heating coils, and industrial bearings.',
    badge: 'Authentic OEM Warranty',
    icon: PackageCheck,
    highlights: [
      'Original Danube, Speed Queen, and LG factory spares',
      'SKF/FAG heavy-duty bearings & Viton oil seals',
      '3-inch motorized Italian drain valves & solenoids',
      'Immediate pan-India courier or on-site delivery',
    ],
    sla: 'Same-Day Dispatch Available',
  },
  {
    id: 'relocation',
    title: 'Industrial Plant Relocation & Dismantling',
    tagline: 'Safe rigging, crating, transport and re-commissioning',
    description:
      'Moving heavy laundry equipment between facilities requires engineering care. We de-commission, lock suspension mounts, professionally rig, transport, and re-install your machines at your new location.',
    badge: 'Damage-Free Rigging',
    icon: Truck,
    highlights: [
      'Suspension drum locking & sensor protection',
      'Heavy crane rigging and vibration-dampened transport',
      'Re-leveling, utility reconnections, and steam line piping',
      'Full post-relocation performance and load testing',
    ],
    sla: 'Complete Facility Handover',
  },
  {
    id: 'audit',
    title: 'Energy, Water & Chemical Audits',
    tagline: 'Optimize wash cycles to save power, water, and detergents',
    description:
      'Commercial laundry utilities make up over 60% of ongoing operating costs. Our technical team conducts on-site audits to reduce water consumption per kg, improve heat retention, and lower electrical utility bills.',
    badge: 'Cost Reduction Audit',
    icon: Zap,
    highlights: [
      'Water recycle & rinse water efficiency review',
      'Steam trap & condensate return heat monitoring',
      'Inverter frequency ramp optimization',
      'Detailed ROI and utility cost-reduction report',
    ],
    sla: '15-30% Utility Savings Target',
  },
];

const maintenanceWorkflow = [
  {
    step: '01',
    title: 'Consultation & Site Audit',
    desc: 'Our senior laundry engineers evaluate your linen volume, daily wash cycles, utility supply lines, and machine operating logs.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Precision Diagnosis',
    desc: 'We conduct digital drive scans, bearing vibration analysis, motor temperature mapping, and valve flow rate measurements.',
    icon: Wrench,
  },
  {
    step: '03',
    title: 'Certified OEM Overhaul',
    desc: 'Any worn parts are replaced with authentic Danube, Speed Queen, or LG factory spares backed by full manufacturer warranty.',
    icon: Settings,
  },
  {
    step: '04',
    title: 'Digital Handover & AMC',
    desc: 'A certified engineer service report is generated on-site, complete with future maintenance recommendations and AMC scheduling.',
    icon: FileCheck2,
  },
];

const industriesServed = [
  { name: 'Hospitals & Healthcare', desc: 'Sterilization & barrier washer systems', icon: HeartPulse },
  { name: 'Hotels & Luxury Resorts', desc: 'High-turnaround linen & flatwork ironing', icon: Hotel },
  { name: 'Garment & Textile Processing', desc: 'Heavy dye & enzyme wash extractors', icon: Shirt },
  { name: 'Commercial & Cloud Laundries', desc: 'Continuous multi-shift washing lines', icon: Building2 },
];

export default function Services() {
  const { openDrawer } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-service-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-12 pb-16 pt-2">
      {/* 6 CORE SERVICE OFFERINGS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
              Services &amp; Maintenance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Commercial Laundry Engineering Capabilities
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] text-white font-bold text-xs sm:text-sm px-4 py-2.5 shadow-sm hover:brightness-105 transition-all"
            >
              <span>Book Service / AMC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="gsap-service-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,43,139,0.04)] hover:shadow-[0_18px_45px_rgba(0,43,139,0.12)] transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Top Brand Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Icon & Badge Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#002B8B] border border-blue-100 shadow-2xs group-hover:scale-105 group-hover:bg-[#002B8B] group-hover:text-white transition-all duration-200">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#002B8B]" />
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#002B8B] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {service.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: SLA & Action Button */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#1268D8]" />
                    <span>{service.sla}</span>
                  </div>

                  <Link
                    href={`/enquiry?service=${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:text-[#1268D8] transition-colors group-hover:translate-x-0.5"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          3. 4-STAGE MAINTENANCE PROTOCOL (TIMELINE STANDARD)
      ========================================================= */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-[#CCE0F5] bg-gradient-to-b from-[#F7FBFF] to-[#EDF5FD] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,43,139,0.06)]">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Proven Engineering Protocol
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How We Maintain Laundry Equipment Life
          </h2>
          <p className="text-sm text-slate-600">
            Every service call and AMC audit follows our structured 4-step engineering verification protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {maintenanceWorkflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/90 bg-white/90 p-6 shadow-sm backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest text-[#1268D8]">
                    STEP {item.step}
                  </span>
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#002B8B] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          4. INDUSTRIES SERVED RIBBON
      ========================================================= */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Sectors We Actively Support
            </h3>
            <p className="text-xs text-slate-500">
              Over 500+ commercial machines installed and maintained across Tamil Nadu &amp; Kerala.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Commercial Partner</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industriesServed.map((ind) => {
            const Icon = ind.icon;

            return (
              <div
                key={ind.name}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-100/70 text-[#002B8B] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{ind.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ind.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          5. CALL TO ACTION BANNER - CLEAN & ACTION-ORIENTED
      ========================================================= */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] p-8 sm:p-12 text-white shadow-xl shadow-blue-900/15">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Rapid Engineering Support</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
            Need Expert Maintenance or an Emergency Repair?
          </h2>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
            Whether you are planning a new commercial laundry setup, upgrading inverter drives, or requiring an annual AMC contract, our senior engineers are ready to assist.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#002B8B] font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:bg-slate-100 transition-colors"
            >
              <span>Submit Service Request</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/918110012041?text=Hi%20SL%20Laundry%20Tech,%20I%20need%20commercial%20machine%20service/AMC%20support."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 transition-colors backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Engineers</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
