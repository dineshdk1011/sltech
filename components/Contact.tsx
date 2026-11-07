'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Factory,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { NAP, SITE_URL } from '@/lib/site';
import { createClient } from '@/lib/supabase/client';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    requirementType: 'New Machinery Purchase',
    location: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-contact-card',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Log to Supabase enquiries table
      const supabase = createClient();
      await supabase.from('enquiries').insert({
        name: formData.name,
        company: formData.company || 'Not Specified',
        phone: formData.phone,
        email: formData.email || '',
        message: `[Requirement: ${formData.requirementType}] [Location: ${formData.location}] ${formData.message}`,
        status: 'pending',
      });

      setSubmitted(true);

      // 2. Format WhatsApp link
      const waText = encodeURIComponent(
        `Hi SL Laundry Tech! I am reaching out from your Contact Page.\n\n` +
          `*Name:* ${formData.name}\n` +
          `*Company:* ${formData.company || 'N/A'}\n` +
          `*Phone:* ${formData.phone}\n` +
          `*Requirement:* ${formData.requirementType}\n` +
          `*Location:* ${formData.location || 'N/A'}\n` +
          `*Message:* ${formData.message || 'Need quotation/service assistance.'}`
      );

      // Open WhatsApp in new tab for instant response
      window.open(`https://wa.me/918110012041?text=${waText}`, '_blank');
    } catch {
      // If error occurs, still open WhatsApp
      const waText = encodeURIComponent(
        `Hi SL Laundry Tech! Contact Inquiry: ${formData.name} (${formData.phone}) - ${formData.requirementType}: ${formData.message}`
      );
      window.open(`https://wa.me/918110012041?text=${waText}`, '_blank');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-10 pb-16 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#002B8B]">
            Help Desk &amp; Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact Senior Engineers
          </h1>
        </div>
        <a
          href="tel:+919361624107"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs w-fit"
        >
          <Phone className="w-3.5 h-3.5 text-[#002B8B]" />
          <span>Hotline: +91 93616 24107</span>
        </a>
      </div>

      {/* TWO-COLUMN MAIN CONTACT & FORM SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1.5 border-b border-slate-100 pb-5">
            <span className="text-xs font-black uppercase tracking-wider text-[#002B8B]">
              Direct Inquiries
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Submit Your Machinery / Service Request
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Fill in your details below and our technical desk will prepare an itemized specification or dispatch report.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950">
                Inquiry Successfully Logged!
              </h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you! Your inquiry has been recorded into our engineering system and dispatched to our technical desk via WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    company: '',
                    phone: '',
                    email: '',
                    requirementType: 'New Machinery Purchase',
                    location: '',
                    message: '',
                  });
                }}
                className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>

                {/* Company / Facility */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Company / Facility Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Residency Hotel / Apollo Hospital"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="engineering@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Requirement Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Requirement Type
                  </label>
                  <select
                    value={formData.requirementType}
                    onChange={(e) => setFormData({ ...formData, requirementType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B] bg-white"
                  >
                    <option value="New Machinery Purchase">New Commercial Machinery Purchase</option>
                    <option value="Genuine OEM Spare Parts">Genuine OEM Spare Parts Supply</option>
                    <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
                    <option value="Emergency Breakdown Repair">Emergency Breakdown Service</option>
                    <option value="Machine Relocation / Installation">Machine Relocation &amp; Installation</option>
                  </select>
                </div>

                {/* City / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Plant City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tiruppur / Coimbatore / Kochi"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Project / Machinery Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Mention machine capacity needed (e.g. 28 kg washer extractor, barrier washer), brand preference, or spare parts part numbers..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:from-[#002477] hover:to-[#0f5ec4] text-white font-bold text-sm py-3.5 shadow-md shadow-blue-900/15 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Logging Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit &amp; Open WhatsApp Chat</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Office Coordinates & Emergency Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Hotline Card */}
          <div className="rounded-3xl border border-blue-200/90 bg-gradient-to-br from-[#002B8B] via-[#073A98] to-[#001D5E] p-6 sm:p-7 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                24/7 AMC Emergency Dispatch
              </span>
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>

            <h3 className="text-xl font-bold leading-snug">
              Commercial Machine Breakdown?
            </h3>

            <p className="text-xs text-blue-100 leading-relaxed font-normal">
              For hospitals, hotels, and industrial laundries on contract, call our priority engineering hotline for instant troubleshooting and same-day engineer dispatch.
            </p>

            <a
              href="tel:+919361624107"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white text-[#002B8B] font-extrabold text-xs sm:text-sm px-4 py-2.5 shadow-md hover:bg-slate-100 transition-colors w-full justify-center"
            >
              <Phone className="w-4 h-4" />
              <span>+91 93616 24107</span>
            </a>
          </div>

          {/* Central Office Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Headquarters &amp; Central Depot
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Address */}
              <div className="flex items-start gap-3 text-slate-700">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#002B8B] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Tiruppur Office:</span>
                  <span className="text-slate-600 leading-relaxed">{NAP.streetAddress}, {NAP.addressRegion}, Tamil Nadu.</span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 text-slate-700">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#002B8B] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Working Hours:</span>
                  <span className="text-slate-600">Monday – Saturday: 9:00 AM – 7:00 PM</span>
                  <span className="text-[11px] text-slate-400 block">Sunday: Emergency AMC Breakdown Only</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 text-slate-700">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#002B8B] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Official Email:</span>
                  <a href={`mailto:${NAP.email}`} className="text-[#1268D8] hover:underline font-semibold">
                    {NAP.email}
                  </a>
                </div>
              </div>

              {/* Coverage */}
              <div className="flex items-start gap-3 text-slate-700">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-[#002B8B] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Service Coverage:</span>
                  <span className="text-slate-600">Tamil Nadu, Kerala &amp; Pan-India Machinery Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}