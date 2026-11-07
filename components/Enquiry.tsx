'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Layers,
  LoaderCircle,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import { useCart } from './CartContext';
import statesData from '@/lib/states_ut.json';
import districtsData from '@/lib/districts.json';
import { BRANCHES, MACHINES, SPARE_PARTS } from '@/lib/catalog-data';
import { createClient } from '@/lib/supabase/client';

export default function Enquiry() {
  const { items, removeItem, updateQuantity, clearItems, setSubmissionResult, addItem } = useCart();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('31'); // Tamil Nadu
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('tiruppur');
  const [serviceType, setServiceType] = useState('Machine & Spare Parts Quote');
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick machine/part adder dropdown states
  const [quickAddMachineId, setQuickAddMachineId] = useState('');
  const [quickAddPartId, setQuickAddPartId] = useState('');

  const currentDistricts = selectedStateId
    ? districtsData.find((s) => s.state_id.toString() === selectedStateId)?.districts || []
    : [];

  const handleQuickAddMachine = (machineId: string) => {
    if (!machineId) return;
    const m = MACHINES.find((x) => x.id === machineId);
    if (!m) return;
    addItem({
      id: m.id,
      type: 'machine',
      title: m.name,
      subtitle: `${m.brand} • ${m.capacityLabel} • ${m.heatingType}`,
      category: 'Commercial Laundry Machine',
      image: m.image,
      quantity: 1,
    });
    setQuickAddMachineId('');
  };

  const handleQuickAddPart = (partId: string) => {
    if (!partId) return;
    const p = SPARE_PARTS.find((x) => x.id === partId);
    if (!p) return;
    addItem({
      id: p.id,
      type: 'part',
      title: p.name,
      subtitle: `${p.partNumber} • ${p.stockStatus}`,
      category: p.category,
      image: p.image,
      quantity: 1,
    });
    setQuickAddPartId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMessage('Please provide your Full Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const stateObj = statesData.find((s) => s.id.toString() === selectedStateId);
    const stateName = stateObj?.name || 'Tamil Nadu';
    const districtName = selectedDistrict || 'General Service Area';
    const branchObj = BRANCHES.find((b) => b.id === selectedBranch);
    const branchName = branchObj ? branchObj.shortCity : 'Tiruppur Headquarters';

    const refNumber = `SLLT-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowString = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    try {
      const supabase = createClient();
      const itemsSummary = items
        .map((i) => `• [${i.type.toUpperCase()}] ${i.title} (${i.subtitle}) x ${i.quantity}`)
        .join('\n');

      const fullEnquiryText = [
        `Ref ID: ${refNumber}`,
        `Branch: ${branchName}`,
        itemsSummary.length > 0 ? itemsSummary : 'Direct Service Enquiry',
        requirement ? `Notes: ${requirement}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      await supabase.from('enquiry').insert({
        name: fullName.trim(),
        contact: Number(mobileNumber.replace(/\D/g, '')) || 0,
        email: null,
        state: stateName,
        district: districtName,
        address: companyName || null,
        enquiry_type: serviceType,
        contact_method: 'WhatsApp / Call',
        enquiry: fullEnquiryText,
        is_connected: false,
        is_converted: false,
        last_update: `Enquiry submitted with ${items.length} items`,
      });
    } catch (err) {
      console.warn('Backend Supabase sync (static fallback):', err);
    }

    setSubmissionResult({
      refId: refNumber,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      companyName: companyName.trim() || undefined,
      state: stateName,
      district: districtName,
      branch: branchName,
      serviceType,
      requirement: requirement.trim() || undefined,
      submittedAt: nowString,
      items: [...items],
    });

    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-16 md:px-6 md:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#002B8B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Equipment Catalog
        </Link>
      </div>

      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002B8B] text-white shadow-lg shadow-blue-900/20 mb-3">
          <Send className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#002B8B] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Commercial Laundry Machinery &amp; Parts Quotation
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Submit Enquiry &amp; Receive Instant Quote
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Whether you need a new commercial washing machine, flatwork ironer, tumble dryer, or
          genuine spare parts, fill out this quotation request. Our engineering team responds within
          15 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SELECTED ITEMS BASKET & QUICK ADDER */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-[#002B8B] rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Selected Items for Quote
                  </h3>
                  <p className="text-xs text-slate-500">
                    {items.length === 0
                      ? 'No items selected yet'
                      : `${items.length} items configured`}
                  </p>
                </div>
              </div>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearItems}
                  className="text-xs text-red-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* List */}
            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-8 px-3 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">
                    You haven&apos;t added any equipment or parts yet. Use the quick add dropdowns below
                    or explore the catalog.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="relative h-12 w-12 shrink-0 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          item.type === 'machine'
                            ? 'bg-blue-100 text-[#002B8B]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Dropdowns */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  + Quick Add Commercial Machine
                </label>
                <select
                  value={quickAddMachineId}
                  onChange={(e) => handleQuickAddMachine(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">Choose machine to add...</option>
                  {MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.brand}] {m.name} ({m.capacityLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  + Quick Add Genuine Spare Part
                </label>
                <select
                  value={quickAddPartId}
                  onChange={(e) => handleQuickAddPart(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="">Choose spare part to add...</option>
                  {SPARE_PARTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.partNumber}] {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SLA Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#061B3B] to-[#0A3A7C] text-white p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Direct Engineering Guarantee
            </div>
            <h4 className="mt-2 text-base font-extrabold text-white">
              Why Inquire with SL Laundry Tech?
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Authorized dealer for Danube, Speed Queen &amp; LG Commercial</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Immediate 15-minute quote response during business hours</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Genuine OEM spare parts with replacement warranty</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Pan-India installation, commissioning and AMC support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN ENQUIRY FORM */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Enquiry Information</h2>
                <p className="text-xs text-slate-500">
                  Fill in your details to receive an itemized quotation &amp; technical sheet.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                No Obligation Quote
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number (Voice &amp; WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Business / Hotel / Hospital Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Grand Palace Hotel, Sunrise Multi-speciality Hospital"
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    State / Union Territory *
                  </label>
                  <select
                    value={selectedStateId}
                    onChange={(e) => {
                      setSelectedStateId(e.target.value);
                      setSelectedDistrict('');
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  >
                    {statesData.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    District / City
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  >
                    <option value="">Select district</option>
                    {currentDistricts.map((d) => (
                      <option key={d.district_name} value={d.district_name}>
                        {d.district_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch & Requirement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Service Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Requirement Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  >
                    <option value="Machine & Spare Parts Quote">Machine &amp; Spare Parts Quote</option>
                    <option value="New Machine Sales">New Commercial Machine Purchase</option>
                    <option value="Spare Parts Immediate Supply">Spare Parts Supply</option>
                    <option value="Installation & Commissioning">Installation &amp; Commissioning</option>
                    <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract</option>
                    <option value="Urgent Breakdown Support">Emergency Breakdown Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Requirements / Load Details (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="Provide details about your daily laundry load, electrical phase (3-phase/1-phase), steam boiler availability, or specific machine brand preferences..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] text-white font-bold text-sm shadow-xl shadow-blue-900/25 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSubmitting
                    ? 'Submitting & Generating Quotation Ref...'
                    : `Submit Enquiry ${items.length > 0 ? `(${items.length} Items Selected)` : ''}`}
                </button>

                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Once submitted, an official quotation summary &amp; reference ID will be displayed with
                  one-click WhatsApp copy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}