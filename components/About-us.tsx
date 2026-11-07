'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Factory,
  Headphones,
  HeartHandshake,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users2,
  Wrench,
  Zap,
} from 'lucide-react';

const statsData = [
  { value: '15+', label: 'Years Engineering Experience', sub: 'Commercial machinery specialists' },
  { value: '500+', label: 'Industrial Machines Installed', sub: 'Hospitals, hotels & textile units' },
  { value: '99.2%', label: 'AMC Plant Uptime SLA', sub: 'Guaranteed preventive maintenance' },
  { value: '3 Hubs', label: 'Tiruppur, Chennai & Kochi', sub: 'Rapid pan-South India dispatch' },
];

const pillars = [
  {
    title: 'OEM Component Integrity',
    desc: 'We never compromise with counterfeit or unverified parts. All maintenance replacements use certified original manufacturer spares.',
    icon: ShieldCheck,
    tag: '100% Authentic',
  },
  {
    title: 'Preventive Over Reactive Care',
    desc: 'Our structured AMC programs focus on motor vibration analysis, inverter thermal monitoring, and early seal replacement before catastrophic breakdown occurs.',
    icon: Wrench,
    tag: 'Downtime Prevention',
  },
  {
    title: 'Transparent Digital Handover',
    desc: 'Every service visit results in an itemized digital engineer report with cycle logs, electrical readings, and clear parts wear indicators.',
    icon: BadgeCheck,
    tag: 'Certified Reporting',
  },
  {
    title: 'Turnkey Utility Engineering',
    desc: 'We manage full mechanical anchoring, steam pressure reduction, water softening, and 3-phase electrical load balancing from day one.',
    icon: Zap,
    tag: 'Complete Execution',
  },
];

const hubs = [
  {
    city: 'Tiruppur Headquarters & Central Warehouse',
    state: 'Tamil Nadu',
    role: 'Central spare parts depot, overhaul workshop & primary engineering team',
    icon: Factory,
  },
  {
    city: 'Chennai Regional Service Hub',
    state: 'Tamil Nadu',
    role: 'Hospitality & healthcare emergency dispatch team',
    icon: Building2,
  },
  {
    city: 'Kochi & Kerala Service Hub',
    state: 'Kerala',
    role: 'Commercial laundry & hotel AMC service support',
    icon: MapPin,
  },
];

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-about-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
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
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Company Profile · Tiruppur Headquarters
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            About SL Laundry Tech
          </h1>
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          Commercial Machinery &amp; Engineering Maintenance
        </span>
      </div>

      {/* KEY ENGINEERING METRICS RIBBON */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs text-center space-y-1 hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#002B8B] to-[#1268D8] bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              {stat.label}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {stat.sub}
            </div>
          </div>
        ))}
      </section>

      {/* =========================================================
          3. COMPANY STORY & ENGINEERING FOUNDATION
      ========================================================= */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#002B8B]">
              Our Foundation &amp; Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              Built on Heavy Industrial Roots in South India
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Commercial laundry equipment is not an off-the-shelf appliance—it is a critical revenue and operational pillar. When a 60 kg washer-extractor in a 300-bed hospital or luxury resort stops, operations immediately stall.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              SL Laundry Tech was founded with a single mission: to provide Indian laundry operators with international-grade machines from verified OEMs (Danube International, Speed Queen, and LG Commercial) backed by immediate, on-the-ground technical servicing and genuine factory spare parts.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authorized Danube Commercial Dealer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Alliance Speed Queen Commercial Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Factory-Trained Field Service Technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated In-House Spares Warehouse</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
              <Image
                src="/About Us.png"
                alt="SL Laundry Tech Commercial Laundry Engineering"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. MISSION & VISION - ENTERPRISE CARDS
      ========================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Guiding Philosophy
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Mission &amp; Strategic Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#CCE0F5] bg-gradient-to-br from-[#002B8B] via-[#073A98] to-[#001D5E] p-8 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-300">
                OUR MISSION
              </span>
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Wrench className="w-5 h-5 text-cyan-300" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-white leading-tight">
              Keep Indian Laundry Operations Running With Zero Downtime
            </h3>

            <p className="text-sm text-blue-100 leading-relaxed font-normal">
              To supply proven, robust commercial laundry equipment paired with relentless on-site technical support. We ensure every hospital, hotel, and textile plant achieves optimum throughput, low utility consumption, and dependable long-term machine life.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-200">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Right Machinery · Genuine Spares · AMC Security</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#CCE0F5] bg-gradient-to-br from-white via-[#F7FAFE] to-[#EDF5FD] p-8 text-slate-900 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#1268D8]">
                OUR VISION
              </span>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#002B8B] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Bring World-Class Laundry Automation Closer to India
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              To establish SL Laundry Tech as the premier commercial laundry infrastructure partner in India. Expanding direct manufacturer relationships with Europe, America, and Asia to deliver cutting-edge water-recycling and smart industrial washing technology.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#002B8B]">
              <Sparkles className="w-4 h-4 text-[#1268D8]" />
              <span>Global Technology · Local Rapid Engineering</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. 4 CORE ENGINEERING COMMITMENTS
      ========================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Why Businesses Choose Us
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Core Engineering Commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="gsap-about-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#002B8B] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          6. REGIONAL SERVICE HUBS
      ========================================================= */}
      <section className="rounded-3xl border border-[#CCE0F5] bg-gradient-to-b from-[#F7FBFF] to-[#EDF5FD] p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#002B8B]">
            Service Footprint
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900">
            Regional Hubs &amp; Rapid Pan-South Dispatch
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Positioned strategically to guarantee rapid on-site breakdown response and fast parts delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hubs.map((hub, i) => {
            const Icon = hub.icon;

            return (
              <div
                key={i}
                className="rounded-2xl border border-white bg-white/95 p-6 shadow-sm space-y-3 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100/70 text-[#002B8B] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{hub.city}</h4>
                    <span className="text-[11px] font-semibold text-[#1268D8]">{hub.state}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {hub.role}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          7. BOTTOM CTA
      ========================================================= */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] p-8 sm:p-12 text-white shadow-xl shadow-blue-900/15">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200 backdrop-blur-sm">
            <Users2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Partner With SL Laundry Tech</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight text-white">
            Ready to Upgrade Your Commercial Laundry Facility?
          </h2>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
            Speak directly with our senior laundry engineers for turnkey plant planning, machine sizing recommendations, or certified spare parts quotes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#002B8B] font-extrabold text-xs sm:text-sm px-6 py-3.5 shadow-md hover:bg-slate-100 transition-colors"
            >
              <span>Submit Project Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+919361624107"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 transition-colors backdrop-blur-sm"
            >
              <Phone className="w-4 h-4 text-cyan-300" />
              <span>Call Senior Engineer: +91 93616 24107</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
