'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  Flame,
  Layers,
  MessageCircle,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import {
  MACHINE_CATEGORIES,
  MACHINES,
  SPARE_PARTS,
  type Machine,
  type MachineCategory,
  type SparePart,
} from '@/lib/catalog-data';
import { useCart } from './CartContext';

interface CategoryViewerModalProps {
  categoryId: string | null;
  onClose: () => void;
}

export default function CategoryViewerModal({
  categoryId,
  onClose,
}: CategoryViewerModalProps) {
  const { addItem, hasItem } = useCart();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'machines' | 'parts'>('machines');

  const modalRef = useRef<HTMLDivElement>(null);

  const category = useMemo(() => {
    if (!categoryId) return null;
    return MACHINE_CATEGORIES.find((c) => c.id === categoryId) || null;
  }, [categoryId]);

  // All machines in this category
  const categoryMachines = useMemo(() => {
    if (!categoryId) return [];
    return MACHINES.filter((m) => m.categoryId === categoryId);
  }, [categoryId]);

  // GSAP: Modal open animation
  useEffect(() => {
    if (!categoryId) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-modal-box',
        { opacity: 0, scale: 0.93, y: 22 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.2)' }
      );
    }, modalRef);

    return () => ctx.revert();
  }, [categoryId]);

  // Brands available in this category with model counts
  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, number>();
    categoryMachines.forEach((m) => {

      brandMap.set(m.brand, (brandMap.get(m.brand) || 0) + 1);
    });

    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Brands', count: categoryMachines.length },
    ];

    brandMap.forEach((count, brand) => {
      list.push({ id: brand, label: brand, count });
    });

    return list;
  }, [categoryMachines]);

  // Capacities available in this category with counts
  const capacityOptions = useMemo(() => {
    const tiers = [
      { id: 'all', label: 'All Sizes', subtext: 'Full capacity spectrum' },
      { id: 'compact', label: 'Compact', subtext: '10 - 15 KG' },
      { id: 'medium', label: 'Medium', subtext: '16 - 25 KG' },
      { id: 'heavy', label: 'Heavy', subtext: '26 - 40 KG' },
      { id: 'industrial', label: 'Industrial', subtext: '50+ KG' },
    ];

    return tiers.map((tier) => {
      const count =
        tier.id === 'all'
          ? categoryMachines.length
          : categoryMachines.filter((m) => m.capacityTier === tier.id).length;
      return { ...tier, count };
    });
  }, [categoryMachines]);

  // Filtered machines based on selected brand & capacity
  const filteredMachines = useMemo(() => {
    return categoryMachines.filter((m) => {
      if (selectedBrand !== 'all' && m.brand !== selectedBrand) return false;
      if (selectedCapacity !== 'all' && m.capacityTier !== selectedCapacity) return false;
      return true;
    });
  }, [categoryMachines, selectedBrand, selectedCapacity]);

  // Spare parts compatible with this category
  const categoryParts = useMemo(() => {
    if (!categoryId) return [];
    return SPARE_PARTS.filter((p) => p.applicableCategoryIds.includes(categoryId));
  }, [categoryId]);

  // GSAP: Filter change animation
  useEffect(() => {
    if (!categoryId) return;
    gsap.fromTo(
      '.gsap-model-item',
      { opacity: 0, y: 14, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.04, ease: 'power2.out' }
    );
  }, [selectedBrand, selectedCapacity, activeTab, filteredMachines.length]);

  if (!categoryId || !category) return null;

  const isFiltering = selectedBrand !== 'all' || selectedCapacity !== 'all';

  const resetFilters = () => {
    setSelectedBrand('all');
    setSelectedCapacity('all');
  };

  const handleSelectMachine = (machine: Machine) => {
    addItem({
      id: machine.id,
      type: 'machine',
      title: machine.name,
      subtitle: `${machine.brand} • ${machine.capacityLabel}`,
      category: category.name,
      image: machine.image,
      quantity: 1,
    });
  };

  const handleSelectPart = (part: SparePart) => {
    addItem({
      id: part.id,
      type: 'part',
      title: part.name,
      subtitle: `${part.partNumber} • ${part.stockStatus}`,
      category: part.category,
      image: part.image,
      quantity: 1,
    });
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="gsap-modal-box relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border border-blue-100 bg-white shadow-2xl overflow-hidden text-slate-900">
        {/* MODAL HEADER */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-white via-slate-50/50 to-blue-50/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#002B8B] text-white">
                  Machinery Line
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {category.capacityRange}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {categoryMachines.length} Models Available
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {category.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 max-w-2xl">
                {category.description}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher: Models vs Compatible Spares */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('machines')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'machines'
                    ? 'bg-white text-[#002B8B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Equipment Models ({categoryMachines.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('parts')}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'parts'
                    ? 'bg-white text-[#002B8B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compatible Spare Parts ({categoryParts.length})</span>
              </button>
            </div>

            {/* Reset Filters shortcut if filtering */}
            {activeTab === 'machines' && isFiltering && (
              <button
                type="button"
                onClick={resetFilters}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:text-[#001f66] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ENHANCED FILTER TOOLBAR (FOR MACHINES) */}
        {activeTab === 'machines' && (
          <div className="shrink-0 p-4 sm:px-6 bg-slate-50/90 border-b border-slate-200/80 space-y-3">
            {/* 1. BRAND FILTER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 w-24 shrink-0">
                <SlidersHorizontal className="w-3 h-3 text-[#002B8B]" />
                <span>Brand:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {availableBrands.map((b) => {
                  const isActive = selectedBrand === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBrand(b.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#002B8B] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                      }`}
                    >
                      <span>{b.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {b.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SIZE / CAPACITY FILTER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 w-24 shrink-0">
                <Package className="w-3 h-3 text-[#002B8B]" />
                <span>Size:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {capacityOptions.map((c) => {
                  const isActive = selectedCapacity === c.id;
                  const hasMatches = c.count > 0;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCapacity(c.id)}
                      disabled={!hasMatches && c.id !== 'all'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#002B8B] text-white shadow-xs'
                          : hasMatches
                          ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                          : 'bg-slate-100/50 text-slate-300 border border-transparent cursor-not-allowed'
                      }`}
                    >
                      <span>{c.label}</span>
                      {c.subtext && (
                        <span
                          className={`text-[10px] ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          ({c.subtext})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active filter count status bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <div>
                Showing <strong className="text-slate-900">{filteredMachines.length}</strong> of{' '}
                {categoryMachines.length} models
                {isFiltering && (
                  <span className="text-[#002B8B] font-semibold ml-1">
                    (Filters: {selectedBrand !== 'all' ? selectedBrand : 'All Brands'} •{' '}
                    {selectedCapacity !== 'all' ? selectedCapacity : 'All Sizes'})
                  </span>
                )}
              </div>
              {isFiltering && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="sm:hidden text-xs font-bold text-[#002B8B] underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE CONTENT) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {activeTab === 'machines' ? (
            filteredMachines.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#002B8B] flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No models match this brand and size combination
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  We have other sizes available for{' '}
                  <strong className="text-slate-800">{selectedBrand}</strong>, or other brands in{' '}
                  <strong className="text-slate-800">{selectedCapacity}</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002B8B] text-white text-xs font-bold hover:bg-[#001f66] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>View All {category.name}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMachines.map((machine) => {
                  const isSelected = hasItem(machine.id);
                  const whatsappMessage = encodeURIComponent(
                    `Hello SL Laundry Tech, I am interested in getting a quotation and specifications for: ${machine.brand} ${machine.name} (${machine.capacityLabel}, Model: ${machine.modelCode}). Please assist me.`
                  );

                  return (
                    <div
                      key={machine.id}
                      className={`gsap-model-item flex flex-col justify-between rounded-2xl border p-4 bg-white transition-all duration-200 ${
                        isSelected
                          ? 'border-[#002B8B] shadow-lg ring-2 ring-[#002B8B]/20'
                          : 'border-slate-200/90 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Brand & Capacity Header */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#002B8B] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                            {machine.isAuthorizedDealer && (
                              <BadgeCheck className="w-3 h-3 text-[#002B8B]" />
                            )}
                            <span>{machine.brand}</span>
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {machine.capacityLabel}
                          </span>
                        </div>

                        {/* Machine Image */}
                        <div className="relative h-44 w-full rounded-xl bg-gradient-to-b from-[#F9FBFE] to-[#EEF5FD] overflow-hidden my-2 flex items-center justify-center p-3 border border-slate-100">
                          <Image
                            src={machine.image}
                            alt={machine.name}
                            fill
                            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                          />
                          {machine.heatingType && (
                            <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-white/95 text-slate-700 shadow-xs flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-500" />
                              <span>{machine.heatingType}</span>
                            </span>
                          )}
                          <span className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
                            {machine.modelCode}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 mt-1">
                          {machine.name}
                        </h4>

                        {/* Key Specs Pills & Grid */}
                        <div className="mt-2.5 space-y-1.5 text-[11px] bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                          {machine.spinSpeed && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Extraction Speed:</span>
                              <span className="font-semibold text-slate-800">
                                {machine.spinSpeed}
                              </span>
                            </div>
                          )}
                          {machine.gFactor && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Extraction Force:</span>
                              <span className="font-extrabold text-[#002B8B]">
                                {machine.gFactor}
                              </span>
                            </div>
                          )}
                          {machine.electricalSupply && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Power Supply:</span>
                              <span className="font-medium text-slate-700 truncate max-w-[150px]">
                                {machine.electricalSupply}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1 border-t border-slate-200/50">
                            <span className="text-slate-500">Factory Warranty:</span>
                            <span className="font-bold text-emerald-700">
                              {machine.warrantyYears} Years OEM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 space-y-2">
                        {/* Select for Quotation Basket */}
                        <button
                          type="button"
                          onClick={() => handleSelectMachine(machine)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:brightness-105 text-white shadow-xs shadow-blue-900/15'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Added to Quotation Basket</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>Select for Quotation Basket</span>
                            </>
                          )}
                        </button>

                        {/* WhatsApp Instant Enquiry */}
                        <a
                          href={`https://wa.me/918110012041?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          <Image src="/WA.png" alt="WhatsApp" width={14} height={14} />
                          <span>Instant WhatsApp Enquiry</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* COMPATIBLE SPARE PARTS TAB */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-[#002B8B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#002B8B] shrink-0" />
                  <span>
                    Genuine OEM certified replacement parts with factory serial traceability.
                  </span>
                </div>
                <span className="font-extrabold">{categoryParts.length} Parts Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryParts.map((part) => {
                  const isSelected = hasItem(part.id);
                  const whatsappMessage = encodeURIComponent(
                    `Hello SL Laundry Tech, I need spare part: ${part.name} (Part No: ${part.partNumber}) for my ${category.name}. Please check stock and quotation.`
                  );

                  return (
                    <div
                      key={part.id}
                      className={`gsap-model-item flex flex-col justify-between rounded-2xl border p-4 bg-white transition-all ${
                        isSelected
                          ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-2">
                          <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {part.partNumber}
                          </span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {part.stockStatus}
                          </span>
                        </div>

                        <div className="relative h-32 w-full rounded-xl bg-slate-50 overflow-hidden my-2 border border-slate-100">
                          <Image
                            src={part.image}
                            alt={part.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-1">
                          {part.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                          {part.description}
                        </p>

                        <div className="mt-2 text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <strong>Fits:</strong> {part.compatibleModelsText}
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <button
                          type="button"
                          onClick={() => handleSelectPart(part)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-900 hover:bg-[#002B8B] text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Quote Basket</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Part to Enquiry</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://wa.me/918110012041?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <Image src="/WA.png" alt="WhatsApp" width={12} height={12} />
                          <span>WhatsApp Availability</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

