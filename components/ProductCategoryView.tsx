'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Package,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  MACHINE_CATEGORIES,
  MACHINES,
  SPARE_PARTS,
  type Machine,
  type MachineCategory,
  type SparePart,
} from '@/lib/catalog-data';
import { NAP } from '@/lib/site';
import { useCart } from './CartContext';
import CategoryCardGallery from './CategoryCardGallery';
import ProductCardGallery from './ProductCardGallery';
import PartCardGallery from './PartCardGallery';

interface ProductCategoryViewProps {
  category: MachineCategory;
}

export default function ProductCategoryView({ category }: ProductCategoryViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addItem, hasItem, items, openDrawer } = useCart();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');
  const [selectedHeating, setSelectedHeating] = useState<string>('all');
  const [selectedPartCategory, setSelectedPartCategory] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement>(null);

  const activeTab: 'machines' | 'parts' =
    searchParams.get('tab') === 'parts' ? 'parts' : 'machines';

  const handleTabChange = (tab: 'machines' | 'parts') => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'parts') {
      params.set('tab', 'parts');
    } else {
      params.delete('tab');
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // All machines in this category
  const categoryMachines = useMemo(
    () => MACHINES.filter((m) => m.categoryId === category.id),
    [category.id]
  );

  // All compatible spare parts in this category
  const categoryParts = useMemo(
    () => SPARE_PARTS.filter((p) => p.applicableCategoryIds.includes(category.id)),
    [category.id]
  );

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

  // Capacity tiers tailored per category
  const capacityOptions = useMemo(() => {
    const isIroner = category.id === 'flatwork-ironer';
    const isPress = category.id === 'steam-press';

    const tiers = [
      { id: 'all', label: 'All Sizes', subtext: 'Full range' },
      {
        id: 'compact',
        label: 'Compact',
        subtext: isIroner ? '1.4m Roll' : isPress ? 'Utility' : '10 - 15 kg',
      },
      {
        id: 'medium',
        label: 'Medium',
        subtext: isIroner ? '1.6m - 1.8m' : isPress ? 'Form Finisher' : '16 - 25 kg',
      },
      {
        id: 'heavy',
        label: 'Heavy',
        subtext: isIroner ? '2.0m Roll' : '26 - 40 kg',
      },
      {
        id: 'industrial',
        label: 'Industrial',
        subtext: isIroner ? '3.0m+ Roll' : '50+ kg',
      },
    ];

    return tiers
      .map((tier) => {
        const count =
          tier.id === 'all'
            ? categoryMachines.length
            : categoryMachines.filter((m) => m.capacityTier === tier.id).length;
        return { ...tier, count };
      })
      .filter((tier) => tier.id === 'all' || tier.count > 0);
  }, [category.id, categoryMachines]);

  // Distinct heating methods in this category
  const heatingOptions = useMemo(() => {
    const map = new Map<string, number>();
    categoryMachines.forEach((m) => {
      map.set(m.heatingType, (map.get(m.heatingType) || 0) + 1);
    });
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Heating Types', count: categoryMachines.length },
    ];
    map.forEach((count, heating) => {
      list.push({ id: heating, label: heating, count });
    });
    return list;
  }, [categoryMachines]);

  // Filtered machines
  const filteredMachines = useMemo(() => {
    return categoryMachines.filter((m) => {
      if (selectedBrand !== 'all' && m.brand !== selectedBrand) return false;
      if (selectedCapacity !== 'all' && m.capacityTier !== selectedCapacity) return false;
      if (selectedHeating !== 'all' && m.heatingType !== selectedHeating) return false;
      return true;
    });
  }, [categoryMachines, selectedBrand, selectedCapacity, selectedHeating]);

  // Part categories present in this machine line
  const partCategories = useMemo(() => {
    const map = new Map<string, number>();
    categoryParts.forEach((p) => {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    });
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Spare Parts', count: categoryParts.length },
    ];
    map.forEach((count, cat) => {
      list.push({ id: cat, label: cat, count });
    });
    return list;
  }, [categoryParts]);

  const filteredParts = useMemo(() => {
    if (selectedPartCategory === 'all') return categoryParts;
    return categoryParts.filter((p) => p.category === selectedPartCategory);
  }, [categoryParts, selectedPartCategory]);

  // Other categories for cross-navigation
  const otherCategories = useMemo(
    () => MACHINE_CATEGORIES.filter((c) => c.id !== category.id),
    [category.id]
  );

  // Subtle entrance animation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-cat-reveal',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [category.id, activeTab, selectedBrand, selectedCapacity, selectedHeating, selectedPartCategory]);

  const isFilteringMachines =
    selectedBrand !== 'all' || selectedCapacity !== 'all' || selectedHeating !== 'all';

  const resetFilters = () => {
    setSelectedBrand('all');
    setSelectedCapacity('all');
    setSelectedHeating('all');
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
      meta: {
        Model: machine.modelCode,
        Capacity: machine.capacityLabel,
        Heating: machine.heatingType,
        Warranty: `${machine.warrantyYears} Years`,
      },
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
      meta: {
        'Part #': part.partNumber,
        Warranty: part.warranty,
        Status: part.stockStatus,
      },
    });
  };

  const brandNamesList = Array.from(new Set(categoryMachines.map((m) => m.brand)));

  const categoryWhatsappMsg = encodeURIComponent(
    `Hello SL Laundry Tech, I am exploring your ${category.name} (${category.capacityRange}) range and would like expert sizing advice and a quotation.`
  );

  return (
    <div ref={containerRef} className="space-y-10 pb-16 pt-2">
      {/* 1. BREADCRUMBS & BACK ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#002B8B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#002B8B] transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#002B8B] font-bold">{category.name}</span>
        </nav>

        <Link
          href="/#machines-section"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#002B8B] transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home Machinery Lines</span>
        </Link>
      </div>

      {/* 2. QUICK 6-CATEGORY SWITCHER BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MACHINE_CATEGORIES.map((cat) => {
          const isCurrent = cat.id === category.id;
          return (
            <Link
              key={cat.id}
              href={`/products/${cat.id}`}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isCurrent
                  ? 'bg-[#002B8B] text-white border-[#002B8B] shadow-sm shadow-blue-900/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-[#002B8B]'
              }`}
            >
              <span>{cat.shortName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {MACHINES.filter((m) => m.categoryId === cat.id).length}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 3. CATEGORY HERO OVERVIEW CARD */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-[#DCEBFA] bg-gradient-to-br from-white via-[#F7FAFE] to-[#EAF4FD] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,43,139,0.06)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-[#1268D8]/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#002B8B]/8 blur-3xl" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#002B8B] text-white">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                {category.badge}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#002B8B] border border-blue-100 shadow-2xs">
                Capacity: {category.capacityRange}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {categoryMachines.length} Models • {categoryParts.length} OEM Spares
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 leading-[1.15]">
                {category.name}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {category.description}
              </p>
            </div>

            {/* Category Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {category.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-xl bg-white/85 border border-blue-100/80 p-3 text-xs text-slate-700 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  handleTabChange('machines');
                  document.getElementById('catalog-explorer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:brightness-105 text-white font-bold px-5 py-3 text-xs sm:text-sm shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Browse {categoryMachines.length} Equipment Models</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleTabChange('parts');
                  document.getElementById('catalog-explorer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/60 hover:border-blue-200 text-slate-800 hover:text-[#002B8B] font-bold px-5 py-3 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Compatible Spare Parts ({categoryParts.length})</span>
              </button>

              <a
                href={`${NAP.whatsappHref}?text=${categoryWhatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-3 text-xs sm:text-sm transition-colors"
              >
                <Image src="/WA.png" alt="WhatsApp" width={16} height={16} />
                <span>WhatsApp Expert</span>
              </a>
            </div>
          </div>

          {/* Right Product Image Showcase */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-blue-950/5 space-y-4">
              <CategoryCardGallery
                images={category.images}
                name={category.name}
                badge={category.badge}
                modelCount={categoryMachines.length}
                categoryId={category.id}
                imageHeight="h-64 sm:h-72"
              />

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Available Brands in This Category
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {brandNamesList.map((brand) => (
                    <span
                      key={brand}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#002B8B] border border-blue-100"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Turnkey installation, operator training &amp; AMC available Pan-India.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN INTERACTIVE CATALOG EXPLORER */}
      <section id="catalog-explorer" className="scroll-mt-24 space-y-6">
        {/* Tab Switcher & Basket Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => handleTabChange('machines')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'machines'
                  ? 'bg-white text-[#002B8B] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Equipment Models ({categoryMachines.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('parts')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'parts'
                  ? 'bg-white text-[#002B8B] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Compatible Spare Parts ({categoryParts.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>View Quote Basket ({items.length})</span>
              </button>
            )}
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:underline"
            >
              <span>Need custom sizing help?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ============================================================
            TAB A: EQUIPMENT MODELS
        ============================================================ */}
        {activeTab === 'machines' ? (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
              {/* Brand Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 w-32 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#002B8B]" />
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#002B8B] text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                        }`}
                      >
                        <span>{b.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                          }`}
                        >
                          {b.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capacity / Size Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-2.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 w-32 shrink-0">
                  <Package className="w-3.5 h-3.5 text-[#002B8B]" />
                  <span>Capacity / Size:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {capacityOptions.map((c) => {
                    const isActive = selectedCapacity === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCapacity(c.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#002B8B] text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                        }`}
                      >
                        <span>{c.label}</span>
                        <span
                          className={`text-[10px] ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          ({c.subtext})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Heating Method Filter (only when multiple heating options exist) */}
              {heatingOptions.length > 2 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500 w-32 shrink-0">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Heating:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {heatingOptions.map((h) => {
                      const isActive = selectedHeating === h.id;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setSelectedHeating(h.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#002B8B] text-white shadow-xs'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                          }`}
                        >
                          <span>{h.label}</span>
                          <span
                            className={`text-[10px] px-1.5 rounded-full ${
                              isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                            }`}
                          >
                            {h.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  Showing <strong className="text-slate-900">{filteredMachines.length}</strong> of{' '}
                  {categoryMachines.length} models in {category.shortName}
                </div>
                {isFilteringMachines && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Machines Grid */}
            {filteredMachines.length === 0 ? (
              <div className="text-center py-14 px-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#002B8B] flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  No models match this exact filter combination
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing one of the active brand, capacity, or heating filters to explore all{' '}
                  {category.name.toLowerCase()}.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002B8B] text-white text-xs font-bold hover:bg-[#001f66] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>View All {category.shortName}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map((machine) => {
                  const isSelected = hasItem(machine.id);
                  const basketQty = items.find((i) => i.id === machine.id)?.quantity || 0;
                  const whatsappMessage = encodeURIComponent(
                    `Hello SL Laundry Tech, I am interested in getting a quotation and specifications for: ${machine.brand} ${machine.name} (${machine.capacityLabel}, Model: ${machine.modelCode}). Please assist me.`
                  );

                  return (
                    <article
                      key={machine.id}
                      className={`gsap-cat-reveal group flex flex-col justify-between rounded-3xl border p-5 bg-white transition-all duration-200 ${
                        isSelected
                          ? 'border-[#002B8B] shadow-lg ring-2 ring-[#002B8B]/15'
                          : 'border-slate-200/90 hover:border-blue-300 hover:shadow-xl'
                      }`}
                    >
                      <div>
                        {/* Brand & Capacity Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#002B8B] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            {machine.isAuthorizedDealer && (
                              <BadgeCheck className="w-3.5 h-3.5 text-[#002B8B]" />
                            )}
                            <span>{machine.brand}</span>
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {machine.capacityLabel}
                          </span>
                        </div>

                        {/* 4-Image Interactive Gallery */}
                        <ProductCardGallery
                          images={machine.images}
                          alt={machine.name}
                          href={`/products/${category.id}/${machine.id}`}
                          categoryId={category.id}
                          heatingType={machine.heatingType}
                          modelCode={machine.modelCode}
                          inStock={machine.inStock}
                        />

                        {/* Machine Title */}
                        <Link
                          href={`/products/${category.id}/${machine.id}`}
                          className="block mt-3"
                        >
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#002B8B] transition-colors leading-snug">
                            {machine.name}
                          </h3>
                        </Link>

                        {/* Specs Table */}
                        <div className="mt-3 space-y-1.5 text-xs bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                          {machine.spinSpeed && (
                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">Extraction Speed</span>
                              <span className="font-semibold text-slate-800">
                                {machine.spinSpeed}
                              </span>
                            </div>
                          )}
                          {machine.gFactor && (
                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">G-Factor</span>
                              <span className="font-extrabold text-[#002B8B]">
                                {machine.gFactor}
                              </span>
                            </div>
                          )}
                          {machine.drumVolume && (
                            <div className="flex justify-between gap-2">
                              <span className="text-slate-500">Drum / Roll Size</span>
                              <span className="font-semibold text-slate-800 text-right truncate max-w-[175px]">
                                {machine.drumVolume}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-500">Power Supply</span>
                            <span className="font-medium text-slate-700 text-right truncate max-w-[175px]">
                              {machine.electricalSupply}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2 pt-1.5 border-t border-slate-200/60">
                            <span className="text-slate-500">Warranty &amp; Dispatch</span>
                            <span className="font-bold text-emerald-700">
                              {machine.warrantyYears} Yrs • {machine.leadTime}
                            </span>
                          </div>
                        </div>

                        {/* Top Key Features */}
                        <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                          {machine.keyFeatures.slice(0, 2).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Best For */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {machine.bestFor.slice(0, 2).map((useCase, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                        <Link
                          href={`/products/${category.id}/${machine.id}`}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#002B8B]/40 text-slate-800 hover:text-[#002B8B] text-xs font-bold transition-all"
                        >
                          <span>View Full Specs &amp; Compatible Parts</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={openDrawer}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>In Basket ({basketQty}) • Open Quote</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectMachine(machine)}
                              className="px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-extrabold cursor-pointer"
                              title="Add 1 more unit"
                            >
                              +1
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectMachine(machine)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:brightness-105 text-white text-xs font-bold transition-all shadow-sm shadow-blue-900/15 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Select for Quotation Basket</span>
                          </button>
                        )}

                        <a
                          href={`${NAP.whatsappHref}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 text-[11px] font-bold transition-colors"
                        >
                          <Image src="/WA.png" alt="WhatsApp" width={14} height={14} />
                          <span>Instant WhatsApp Enquiry</span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================
             TAB B: COMPATIBLE SPARE PARTS
          ============================================================ */
          <div className="space-y-6">
            <div className="rounded-2xl bg-blue-50/80 border border-blue-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 text-xs sm:text-sm text-[#002B8B]">
                <ShieldCheck className="w-5 h-5 text-[#002B8B] shrink-0" />
                <span>
                  Genuine OEM certified replacement parts for <strong>{category.name}</strong> with
                  24–48h Pan-India dispatch.
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#002B8B] bg-white px-3 py-1 rounded-full border border-blue-100 w-fit shrink-0">
                {filteredParts.length} Listed • {category.partCount}+ Stocked
              </span>
            </div>

            {/* Part Category Filter Pills */}
            {partCategories.length > 2 && (
              <div className="flex flex-wrap items-center gap-2">
                {partCategories.map((pc) => {
                  const isActive = selectedPartCategory === pc.id;
                  return (
                    <button
                      key={pc.id}
                      type="button"
                      onClick={() => setSelectedPartCategory(pc.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#002B8B] text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{pc.label}</span>
                      <span
                        className={`text-[10px] px-1.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pc.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => {
                const isSelected = hasItem(part.id);
                const basketQty = items.find((i) => i.id === part.id)?.quantity || 0;
                const whatsappMessage = encodeURIComponent(
                  `Hello SL Laundry Tech, I need spare part: ${part.name} (Part No: ${part.partNumber}) for my ${category.name}. Please check stock and quotation.`
                );

                return (
                  <article
                    key={part.id}
                    className={`gsap-cat-reveal flex flex-col justify-between rounded-3xl border p-5 bg-white transition-all ${
                      isSelected
                        ? 'border-emerald-600 shadow-lg ring-2 ring-emerald-500/20'
                        : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                          {part.partNumber}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          {part.stockStatus}
                        </span>
                      </div>

                      {/* 4-Image Spare Part Gallery */}
                      <PartCardGallery
                        images={part.images}
                        name={part.name}
                        partNumber={part.partNumber}
                        category={part.category}
                      />

                      <h3 className="text-sm font-extrabold text-slate-900 mt-3 leading-snug">
                        {part.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {part.description}
                      </p>

                      {/* Specifications */}
                      <div className="mt-3 space-y-1 text-[11px] bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        {Object.entries(part.specifications).map(([key, val]) => (
                          <div key={key} className="flex justify-between gap-2">
                            <span className="text-slate-500 shrink-0">{key}:</span>
                            <span className="font-semibold text-slate-800 text-right">{val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-[11px] text-slate-600 bg-blue-50/50 border border-blue-100/80 p-2.5 rounded-xl">
                        <strong className="text-[#002B8B]">Fits:</strong> {part.compatibleModelsText}
                        <div className="text-[10px] text-slate-500 mt-0.5">{part.warranty}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={openDrawer}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>In Basket ({basketQty}) • Open Quote</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectPart(part)}
                            className="px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-extrabold cursor-pointer"
                            title="Add 1 more part"
                          >
                            +1
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectPart(part)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#002B8B] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Part to Enquiry</span>
                        </button>
                      )}

                      <a
                        href={`${NAP.whatsappHref}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition-colors"
                      >
                        <Image src="/WA.png" alt="WhatsApp" width={13} height={13} />
                        <span>WhatsApp Availability</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 5. EXPLORE OTHER MACHINERY LINES */}
      <section className="space-y-5 pt-4 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B8B]">
              Complete Equipment Portfolio
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Explore Other Commercial Machinery Lines
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:underline"
          >
            <span>View All Products &amp; Spares Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {otherCategories.map((other) => (
            <Link
              key={other.id}
              href={`/products/${other.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#002B8B]/40 hover:shadow-md transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="relative h-28 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-3">
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-[10px] font-bold text-[#002B8B] uppercase tracking-wider">
                  {other.capacityRange}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#002B8B] mt-0.5">
                  {other.shortName}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-[#002B8B] pt-2 border-t border-slate-100">
                <span>{MACHINES.filter((m) => m.categoryId === other.id).length} Models</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CONSULTATION CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/20">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Need Help Sizing {category.shortName} for Your Facility?
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
            Tell us your daily linen load in kg, available power phase, or space dimensions. Our senior engineers respond with an itemized proposal within 15 minutes.
          </p>
        </div>

        <div className="shrink-0 flex flex-wrap gap-3">
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#002B8B] text-xs font-black transition-all shadow-md"
          >
            <span>Request Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={NAP.phoneHref}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            <Phone className="w-4 h-4 text-cyan-300" />
            <span>{NAP.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
