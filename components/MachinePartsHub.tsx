'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Eye,
  Filter,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  BRANCHES,
  MACHINE_CATEGORIES,
  MACHINES,
  SPARE_PARTS,
  type Machine,
  type SparePart,
} from '@/lib/catalog-data';
import { useCart } from './CartContext';
import ProductCardGallery from './ProductCardGallery';
import PartCardGallery from './PartCardGallery';

export default function MachinePartsHub() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addItem, hasItem, items, openDrawer } = useCart();

  // Derive URL-backed filters so links like /products?tab=parts or /products?brand=Danube work seamlessly
  const selectedCategory = useMemo(() => {
    const param = searchParams.get('category');
    if (param && MACHINE_CATEGORIES.some((c) => c.id === param)) {
      return param;
    }
    return 'all';
  }, [searchParams]);

  const selectedBrand = useMemo(() => {
    const param = searchParams.get('brand');
    return param || 'all';
  }, [searchParams]);

  const activeTab: 'all' | 'machines' | 'parts' = useMemo(() => {
    const param = searchParams.get('tab');
    return param === 'machines' || param === 'parts' ? param : 'all';
  }, [searchParams]);

  const [selectedCapacityTier, setSelectedCapacityTier] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Available brands derived from catalog data
  const brands = useMemo(() => {
    return Array.from(new Set(MACHINES.map((m) => m.brand)));
  }, []);

  // Filtered Machines
  const filteredMachines = useMemo(() => {
    return MACHINES.filter((m) => {
      if (selectedCategory !== 'all' && m.categoryId !== selectedCategory) return false;
      if (selectedBrand !== 'all' && m.brand !== selectedBrand) return false;
      if (selectedCapacityTier !== 'all' && m.capacityTier !== selectedCapacityTier) return false;
      if (selectedBranch !== 'all' && !m.availableBranches.includes(selectedBranch)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesBrand = m.brand.toLowerCase().includes(query);
        const matchesModel = m.modelCode.toLowerCase().includes(query);
        const matchesFeatures = m.keyFeatures.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesModel && !matchesFeatures) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedBrand, selectedCapacityTier, selectedBranch, searchQuery]);

  // Filtered Spare Parts
  const filteredParts = useMemo(() => {
    return SPARE_PARTS.filter((part) => {
      if (selectedCategory !== 'all' && !part.applicableCategoryIds.includes(selectedCategory)) {
        return false;
      }
      if (
        selectedBrand !== 'all' &&
        !part.compatibleBrands.includes(selectedBrand) &&
        !part.compatibleBrands.includes('Universal')
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = part.name.toLowerCase().includes(query);
        const matchesNum = part.partNumber.toLowerCase().includes(query);
        const matchesCat = part.category.toLowerCase().includes(query);
        const matchesDesc = part.description.toLowerCase().includes(query);
        if (!matchesName && !matchesNum && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  const currentCategoryObj = useMemo(() => {
    return MACHINE_CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const handleSelectMachine = (machine: Machine) => {
    addItem({
      id: machine.id,
      type: 'machine',
      title: machine.name,
      subtitle: `${machine.brand} • ${machine.capacityLabel} • ${machine.heatingType}`,
      category:
        MACHINE_CATEGORIES.find((c) => c.id === machine.categoryId)?.name || 'Commercial Laundry',
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

  return (
    <section id="equipment-catalog" className="scroll-mt-24 space-y-10 pb-16 pt-2">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-[#002B8B] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#002B8B] font-bold">Products &amp; Spare Parts</span>
      </nav>

      {/* Section Header */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#061B3B] via-[#092B5E] to-[#0A3A7C] px-6 py-10 md:px-12 md:py-14 text-white shadow-xl shadow-blue-950/20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Commercial Laundry Equipment &amp; Genuine Spare Parts Hub
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            6 Specialized Machine Types &amp; All-In-One Parts Finder
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-200 leading-relaxed">
            Browse our complete machinery lineup. Filter by{' '}
            <strong className="text-cyan-300">Brand</strong>,{' '}
            <strong className="text-cyan-300">Capacity</strong>, and{' '}
            <strong className="text-cyan-300">Branch Availability</strong>, or open any dedicated
            product page for full specifications.
          </p>

          {/* Quick stats pills */}
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              6 Core Machinery Categories
            </span>
            <span className="rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              Authorized Danube, Speed Queen &amp; LG Commercial
            </span>
            <span className="rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm border border-white/10 flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-400" />
              Over 100+ Genuine Spare Parts in Stock
            </span>
          </div>
        </div>
      </div>

      {/* 6 MACHINE CATEGORY CARDS / QUICK SELECT TABS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#002B8B]">
              Step 1: Choose Commercial Laundry Machine Category
            </h2>
            <p className="text-sm font-semibold text-slate-800">
              Filter below or open a dedicated category page to explore models and compatible parts:
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={openDrawer}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              >
                Basket ({items.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => updateQueryParam('category', 'all')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#002B8B] text-white'
                  : 'text-slate-600 hover:text-[#002B8B] bg-slate-100'
              }`}
            >
              Show All 6 Types
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MACHINE_CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const catPartsCount = SPARE_PARTS.filter((p) =>
              p.applicableCategoryIds.includes(cat.id)
            ).length;
            return (
              <div
                key={cat.id}
                className={`group relative flex flex-col justify-between rounded-2xl p-3.5 transition-all duration-200 border ${
                  isSelected
                    ? 'border-[#002B8B] bg-gradient-to-b from-blue-50/90 to-white shadow-lg shadow-blue-900/10 ring-2 ring-[#002B8B]/20 -translate-y-0.5'
                    : 'border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  onClick={() => updateQueryParam('category', cat.id)}
                  className="text-left cursor-pointer w-full"
                >
                  <div className="relative h-24 w-full rounded-xl bg-slate-100 overflow-hidden mb-3 border border-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur-xs">
                      0{idx + 1}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                      {cat.capacityRange}
                    </span>
                  </div>

                  <h3
                    className={`text-xs font-extrabold line-clamp-1 ${
                      isSelected ? 'text-[#002B8B]' : 'text-slate-900 group-hover:text-[#002B8B]'
                    }`}
                  >
                    {cat.shortName}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {cat.tagline}
                  </p>
                </button>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">{catPartsCount} Parts</span>
                  <Link
                    href={`/products/${cat.id}`}
                    className="font-bold inline-flex items-center gap-0.5 text-[#002B8B] hover:underline"
                  >
                    Open Page <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER CONTROLS BAR (Brand, Capacity, Branch & Search) */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-[#002B8B]" />
            <span className="text-sm font-bold text-slate-900">
              Filter Options: Brand, Capacity &amp; Branch Availability
            </span>
            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
              {filteredMachines.length} Machines / {filteredParts.length} Spare Parts
            </span>
          </div>

          {/* View Tab Buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => updateQueryParam('tab', 'all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#002B8B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All in One Place
            </button>
            <button
              type="button"
              onClick={() => updateQueryParam('tab', 'machines')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'machines'
                  ? 'bg-white text-[#002B8B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Machines ({filteredMachines.length})
            </button>
            <button
              type="button"
              onClick={() => updateQueryParam('tab', 'parts')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'parts'
                  ? 'bg-white text-[#002B8B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Spare Parts ({filteredParts.length})
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {/* Brand Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Brand Wise Filter
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => updateQueryParam('brand', e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
            >
              <option value="all">All Brands (Authorized &amp; Serviced)</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Capacity Wise Filter
            </label>
            <select
              value={selectedCapacityTier}
              onChange={(e) => setSelectedCapacityTier(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
            >
              <option value="all">All Capacities</option>
              <option value="compact">Compact / On-Premise (10 - 15 kg)</option>
              <option value="medium">Medium Commercial (16 - 25 kg)</option>
              <option value="heavy">Heavy Commercial (26 - 40 kg)</option>
              <option value="industrial">Heavy Industrial (50 - 75 kg)</option>
              <option value="extra-heavy">Extra Heavy Duty (80 - 120 kg)</option>
            </select>
          </div>

          {/* Branch Wise Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Branch / Location Filter
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
            >
              <option value="all">All Branches &amp; Service Hubs</option>
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Live Search */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search by Model / Part #
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, VFDs, valves..."
                className="enquiry-search-input w-full pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#002B8B]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SELECTED CATEGORY BANNER DETAILS */}
      {currentCategoryObj && selectedCategory !== 'all' && (
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white shadow-md overflow-hidden shrink-0 border border-blue-100">
              <Image
                src={currentCategoryObj.image}
                alt={currentCategoryObj.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#002B8B] text-white">
                Category Selected
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {currentCategoryObj.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
                {currentCategoryObj.description}
              </p>
            </div>
          </div>

          <Link
            href={`/products/${currentCategoryObj.id}`}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#002B8B] hover:bg-[#001f66] text-white text-xs font-bold transition-colors"
          >
            <span>Open {currentCategoryObj.shortName} Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* SECTION 1: MACHINES LIST */}
      {(activeTab === 'all' || activeTab === 'machines') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>Commercial Machinery Catalog</span>
                <span className="text-xs font-bold bg-blue-100 text-[#002B8B] px-2.5 py-0.5 rounded-full">
                  {filteredMachines.length} Models
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Engineered for maximum reliability, water/energy efficiency, and long lifespan.
              </p>
            </div>
          </div>

          {filteredMachines.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white text-slate-500 text-sm">
              No commercial machines match the selected filters. Try choosing &ldquo;All Brands&rdquo;
              or &ldquo;All Capacities&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMachines.map((machine) => {
                const isSelected = hasItem(machine.id);
                return (
                  <div
                    key={machine.id}
                    className={`group relative flex flex-col rounded-3xl border bg-white p-5 transition-all duration-300 hover:shadow-xl ${
                      isSelected
                        ? 'border-[#002B8B] shadow-md shadow-blue-900/10 ring-1 ring-[#002B8B]'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {machine.brand}
                        </span>
                        {machine.isAuthorizedDealer && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            Authorized Dealer
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-50 text-[#002B8B] border border-blue-100">
                        {machine.capacityLabel}
                      </span>
                    </div>

                    {/* Machine 4-Image Interactive Gallery */}
                    <ProductCardGallery
                      images={machine.images}
                      alt={machine.name}
                      href={`/products/${machine.categoryId}/${machine.id}`}
                      categoryId={machine.categoryId}
                      heatingType={machine.heatingType}
                      modelCode={machine.modelCode}
                      inStock={machine.inStock}
                    />

                    {/* Title & Model */}
                    <div className="flex-1">
                      <div className="text-[10px] font-mono text-slate-400">
                        Model: {machine.modelCode}
                      </div>
                      <Link href={`/products/${machine.categoryId}/${machine.id}`}>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#002B8B] transition-colors">
                          {machine.name}
                        </h3>
                      </Link>

                      {/* Specs pills */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                        {machine.spinSpeed && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">
                              Spin Speed
                            </span>
                            <span className="font-bold text-slate-800">{machine.spinSpeed}</span>
                          </div>
                        )}
                        {machine.gFactor && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">
                              G-Factor
                            </span>
                            <span className="font-bold text-[#002B8B]">{machine.gFactor}</span>
                          </div>
                        )}
                        {machine.drumVolume && (
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold">
                              Volume
                            </span>
                            <span className="font-bold text-slate-800 truncate block">
                              {machine.drumVolume}
                            </span>
                          </div>
                        )}
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">
                            Warranty
                          </span>
                          <span className="font-bold text-emerald-700">
                            {machine.warrantyYears} Years OEM
                          </span>
                        </div>
                      </div>

                      {/* Branch availability tags */}
                      <div className="mt-3">
                        <span className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          Branch Stock:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {machine.availableBranches.slice(0, 3).map((br) => (
                            <span
                              key={br}
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                            >
                              {br}
                            </span>
                          ))}
                          {machine.availableBranches.length > 3 && (
                            <span className="text-[10px] text-slate-400 px-1 py-0.5">
                              +{machine.availableBranches.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/products/${machine.categoryId}/${machine.id}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#002B8B]/40 text-slate-700 hover:text-[#002B8B] text-xs font-bold transition-colors"
                        title="View Full Specifications & Matching Parts"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleSelectMachine(machine)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:brightness-105 text-white shadow-md shadow-blue-900/20'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Selected in Enquiry</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Select for Enquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: GENUINE SPARE PARTS CATALOG */}
      {(activeTab === 'all' || activeTab === 'parts') && (
        <div id="spare-parts" className="scroll-mt-24 space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>Genuine OEM Laundry Spare Parts</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {filteredParts.length} Parts Available
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                100% authentic replacement motors, inverter drives, drain valves, solenoids,
                bearings, gaskets, heating elements &amp; control boards.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pan-India 24-48h Fast Dispatch
            </div>
          </div>

          {filteredParts.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white text-slate-500 text-sm">
              No spare parts match the selected category or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredParts.map((part) => {
                const isSelected = hasItem(part.id);
                return (
                  <div
                    key={part.id}
                    className={`group relative flex flex-col rounded-3xl border bg-white p-5 transition-all duration-300 hover:shadow-xl ${
                      isSelected
                        ? 'border-emerald-600 shadow-md shadow-emerald-900/10 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {/* Top part badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                        {part.partNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {part.stockStatus}
                      </span>
                    </div>

                    {/* Part 4-Image Interactive Gallery */}
                    <PartCardGallery
                      images={part.images}
                      name={part.name}
                      partNumber={part.partNumber}
                      category={part.category}
                    />

                    {/* Part Title & Description */}
                    <div className="flex-1">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {part.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {part.description}
                      </p>

                      {/* Compatible Brands & Models */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                          <Wrench className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">Fits: {part.compatibleModelsText}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                          <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{part.warranty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {part.priceIndicator}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSelectPart(part)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-[#002B8B] text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
