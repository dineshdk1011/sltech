'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  LoaderCircle,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  Send,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useCart } from './CartContext';
import statesData from '@/lib/states_ut.json';
import districtsData from '@/lib/districts.json';
import { BRANCHES } from '@/lib/catalog-data';
import { createClient } from '@/lib/supabase/client';

export default function EnquiryDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearItems,
    setSubmissionResult,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('31'); // default to Tamil Nadu if available
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('tiruppur');
  const [serviceType, setServiceType] = useState('Machine & Spare Parts Quote');
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find districts
  const currentDistricts = selectedStateId
    ? districtsData.find((s) => s.state_id.toString() === selectedStateId)?.districts || []
    : [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStateId(e.target.value);
    setSelectedDistrict('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMessage('Please provide your Full Name and Mobile Number.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Please add at least one machine or spare part to submit an enquiry.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const stateObj = statesData.find((s) => s.id.toString() === selectedStateId);
    const stateName = stateObj?.name || 'Tamil Nadu';
    const districtName = selectedDistrict || 'Tiruppur / General';
    const branchObj = BRANCHES.find((b) => b.id === selectedBranch);
    const branchName = branchObj ? branchObj.shortCity : 'Tiruppur Headquarters';

    const refNumber = `SLLT-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowString = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Try saving to Supabase if available
    try {
      const supabase = createClient();
      const itemsSummary = items
        .map((i) => `• [${i.type.toUpperCase()}] ${i.title} (${i.subtitle}) x ${i.quantity}`)
        .join('\n');

      const fullEnquiryText = [
        `Ref ID: ${refNumber}`,
        `Branch: ${branchName}`,
        itemsSummary,
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
      console.warn('Backend Supabase sync error (continuing in static mode):', err);
    }

    // Set submission result in Context
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
    closeDrawer();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-6">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#002B8B] text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/20">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Enquiry Basket</h2>
                <p className="text-xs text-slate-500">
                  {items.length === 0
                    ? 'No items selected yet'
                    : `${items.length} item${items.length > 1 ? 's' : ''} ready for quotation`}
                </p>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Items List */}
            {items.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 mx-auto rounded-full bg-blue-50 text-[#002B8B] flex items-center justify-center mb-3">
                  <Package className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Your Basket is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Browse our 6 commercial machine types and genuine spare parts catalog, and click
                  &ldquo;Select for Enquiry&rdquo; to build your quote.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002B8B] text-white text-xs font-bold hover:bg-[#001f66] transition-colors"
                >
                  Browse Catalog Now
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Selected Machines &amp; Spare Parts
                  </span>
                  <button
                    onClick={clearItems}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-200 transition-colors"
                    >
                      <div className="relative h-14 w-14 shrink-0 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              item.type === 'machine'
                                ? 'bg-blue-100 text-[#002B8B]'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-1 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Section */}
            {items.length > 0 && (
              <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Your Contact Details</h3>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Quick Turnaround
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company / Hotel / Facility Name (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Grand Palace Hotel / Care Hospital"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State / UT
                    </label>
                    <select
                      value={selectedStateId}
                      onChange={handleStateChange}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B] bg-white"
                    >
                      {statesData.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      District / City
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B] bg-white"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Service Branch
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B] bg-white"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Requirement Type
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B] bg-white"
                    >
                      <option value="Machine & Spare Parts Quote">Machine &amp; Parts Quote</option>
                      <option value="New Machine Purchase">New Machine Purchase</option>
                      <option value="Spare Parts Immediate Supply">Spare Parts Supply</option>
                      <option value="Installation & Commissioning">Installation Support</option>
                      <option value="Annual Maintenance Contract (AMC)">AMC Agreement</option>
                      <option value="Urgent Breakdown Service">Urgent Breakdown Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Notes or Questions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="Mention any power phase, daily laundry load, or urgent delivery requirements..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] text-white font-bold text-sm shadow-lg shadow-blue-900/25 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isSubmitting
                      ? 'Generating Quotation & Registering...'
                      : `Submit Enquiry (${items.length} Items)`}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Instant confirmation card with WhatsApp copy &amp; reference ID generated
                    immediately.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
