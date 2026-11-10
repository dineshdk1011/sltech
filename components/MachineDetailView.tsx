'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  BRANCHES,
  MACHINES,
  SPARE_PARTS,
  type Machine,
  type MachineCategory,
  type SparePart,
} from '@/lib/catalog-data';
import { NAP } from '@/lib/site';
import { useCart } from './CartContext';

interface MachineDetailViewProps {
  category: MachineCategory;
  machine: Machine;
}

export default function MachineDetailView({ category, machine }: MachineDetailViewProps) {
  const { addItem, hasItem, items, openDrawer } = useCart();

  const isSelected = hasItem(machine.id);
  const basketQty = items.find((i) => i.id === machine.id)?.quantity || 0;

  // Resolve exact compatible spare parts first, then category-level parts
  const compatibleParts = useMemo(() => {
    const direct = SPARE_PARTS.filter((p) => machine.compatiblePartIds.includes(p.id));
    if (direct.length > 0) return direct;
    return SPARE_PARTS.filter((p) => p.applicableCategoryIds.includes(category.id));
  }, [machine.compatiblePartIds, category.id]);

  // Resolve branch availability
  const branchesList = useMemo(
    () => BRANCHES.filter((b) => machine.availableBranches.includes(b.id)),
    [machine.availableBranches]
  );

  // Other models in the same category
  const siblingMachines = useMemo(
    () => MACHINES.filter((m) => m.categoryId === category.id && m.id !== machine.id),
    [category.id, machine.id]
  );

  const handleSelectMachine = () => {
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

  const whatsappMessage = encodeURIComponent(
    `Hello SL Laundry Tech, I would like a formal quotation and brochure for ${machine.brand} ${machine.name} (${machine.capacityLabel}, Model: ${machine.modelCode}).`
  );

  const specRows = [
    { label: 'Model Code', value: machine.modelCode },
    { label: 'Brand', value: machine.brand },
    { label: 'Equipment Line', value: category.name },
    { label: 'Capacity / Output', value: machine.capacityLabel },
    { label: 'Heating Method', value: machine.heatingType },
    machine.spinSpeed ? { label: 'Max Extraction Speed', value: machine.spinSpeed } : null,
    machine.gFactor ? { label: 'G-Factor Force', value: machine.gFactor } : null,
    machine.drumVolume ? { label: 'Drum / Cylinder Spec', value: machine.drumVolume } : null,
    { label: 'Overall Dimensions', value: machine.dimensions },
    { label: 'Electrical / Utility Supply', value: machine.electricalSupply },
    { label: 'Factory Warranty', value: `${machine.warrantyYears} Years OEM Warranty` },
    { label: 'Stock & Dispatch', value: machine.leadTime },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-10 pb-16 pt-2">
      {/* 1. BREADCRUMB & BACK LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500"
        >
          <Link href="/" className="hover:text-[#002B8B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#002B8B] transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/products/${category.id}`} className="hover:text-[#002B8B] transition-colors">
            {category.shortName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#002B8B] font-bold">{machine.modelCode}</span>
        </nav>

        <Link
          href={`/products/${category.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#002B8B] transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All {category.shortName}</span>
        </Link>
      </div>

      {/* 2. PRODUCT DETAIL HERO */}
      <section className="rounded-[28px] border border-[#DCEBFA] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_16px_45px_rgba(0,43,139,0.06)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Image Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative h-72 sm:h-96 w-full rounded-3xl bg-gradient-to-b from-[#F9FBFE] to-[#EEF5FD] border border-slate-100 overflow-hidden flex items-center justify-center p-6">
              <Image
                src={machine.image}
                alt={machine.name}
                fill
                priority
                className="object-contain p-4"
              />
              <span className="absolute top-3 left-3 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/95 text-slate-700 border border-slate-200/80 shadow-2xs">
                {machine.modelCode}
              </span>
              {machine.inStock && (
                <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock
                </span>
              )}
              <span className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-white/95 text-slate-800 border border-slate-200/80 flex items-center gap-1.5 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{machine.heatingType} Heating</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Factory Warranty
                </div>
                <div className="font-extrabold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{machine.warrantyYears} Years OEM</span>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Delivery Status
                </div>
                <div className="font-extrabold text-[#002B8B] mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="truncate">{machine.leadTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-[#002B8B] border border-blue-100">
                  {machine.isAuthorizedDealer && <BadgeCheck className="w-3.5 h-3.5" />}
                  <span>{machine.brand}</span>
                </span>
                {machine.isAuthorizedDealer && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Authorized Dealer Unit
                  </span>
                )}
                <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                  {machine.capacityLabel}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {machine.name}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                Part of our{' '}
                <Link href={`/products/${category.id}`} className="font-bold text-[#002B8B] hover:underline">
                  {category.name}
                </Link>{' '}
                lineup. Engineered for continuous commercial reliability, backed by full OEM warranty, turnkey site installation, and Pan-India spare parts support.
              </p>
            </div>

            {/* Key Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Capacity
                </div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{machine.capacityLabel}</div>
              </div>
              {machine.gFactor && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Extraction Force
                  </div>
                  <div className="text-sm font-black text-[#002B8B] mt-0.5">{machine.gFactor}</div>
                </div>
              )}
              {machine.spinSpeed && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Max Spin Speed
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{machine.spinSpeed}</div>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Power / Utility
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{machine.electricalSupply}</div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 col-span-2 sm:col-span-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dimensions (W x D x H)
                </div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{machine.dimensions}</div>
              </div>
            </div>

            {/* Key Industrial Features */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Key Industrial Engineering Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                {machine.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Conversion Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {isSelected ? (
                  <div className="flex-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openDrawer}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Basket ({basketQty}) — Open Quote</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectMachine}
                      className="py-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-sm font-black cursor-pointer"
                      title="Add 1 more unit"
                    >
                      +1
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSelectMachine}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:brightness-105 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select Machine for Quotation Basket</span>
                  </button>
                )}

                <a
                  href={`${NAP.whatsappHref}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-sm font-bold transition-colors"
                >
                  <Image src="/WA.png" alt="WhatsApp" width={18} height={18} />
                  <span>WhatsApp Quotation</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <a
                  href={NAP.phoneHref}
                  className="inline-flex items-center gap-1.5 font-bold text-[#002B8B] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Speak with Senior Engineer: {NAP.phone}</span>
                </a>
                <Link
                  href="/enquiry"
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-[#002B8B] hover:underline"
                >
                  <span>Or submit custom plant enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL TECHNICAL SPECIFICATIONS & APPLICATIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Technical Specifications Table */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4">
            Complete Technical Specifications
          </h2>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 py-3 text-xs sm:text-sm odd:bg-slate-50/70"
              >
                <span className="font-semibold text-slate-500">{row.label}</span>
                <span className="font-bold text-slate-900 sm:text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applications & Regional Availability */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#002B8B]" />
              <h2 className="text-lg font-black text-slate-900">Best Suited Applications</h2>
            </div>
            <p className="text-xs text-slate-500">
              Recommended commercial laundry environments for the {machine.name}:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {machine.bestFor.map((useCase) => (
                <span
                  key={useCase}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-[#002B8B] border border-blue-100"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{useCase}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#002B8B]" />
              <h2 className="text-lg font-black text-slate-900">Branch Stock &amp; Service Hubs</h2>
            </div>
            <p className="text-xs text-slate-500">
              Commissioning, preventive maintenance &amp; spare parts stocked across:
            </p>
            <div className="space-y-2 pt-1">
              {branchesList.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-start justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{branch.name}</div>
                    <div className="text-slate-500 text-[11px]">{branch.address}</div>
                  </div>
                  {branch.isHeadquarters && (
                    <span className="shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#002B8B]">
                      HQ
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPATIBLE GENUINE SPARE PARTS */}
      {compatibleParts.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Wrench className="w-3.5 h-3.5" />
                <span>OEM Replacement Components</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Compatible Genuine Spare Parts for {machine.modelCode}
              </h2>
            </div>
            <Link
              href={`/products/${category.id}?tab=parts`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002B8B] hover:underline"
            >
              <span>View All {category.shortName} Spare Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {compatibleParts.map((part) => {
              const partSelected = hasItem(part.id);
              const partQty = items.find((i) => i.id === part.id)?.quantity || 0;
              return (
                <div
                  key={part.id}
                  className={`flex flex-col justify-between rounded-2xl border p-4 bg-white transition-all ${
                    partSelected
                      ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200/90 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {part.partNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                        {part.stockStatus}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">{part.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{part.description}</p>

                    <div className="mt-3 space-y-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {Object.entries(part.specifications)
                        .slice(0, 3)
                        .map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2">
                            <span className="text-slate-500">{k}:</span>
                            <span className="font-semibold text-slate-800 text-right">{v}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {partSelected ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={openDrawer}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>In Basket ({partQty}) • Open</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPart(part)}
                          className="px-2.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold cursor-pointer"
                        >
                          +1
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectPart(part)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#002B8B] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Spare Part to Enquiry</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. OTHER MODELS IN THIS CATEGORY */}
      {siblingMachines.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Compare Other {category.shortName} Models
            </h2>
            <Link
              href={`/products/${category.id}`}
              className="text-xs font-bold text-[#002B8B] hover:underline inline-flex items-center gap-1"
            >
              <span>All {category.shortName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siblingMachines.slice(0, 3).map((sib) => (
              <Link
                key={sib.id}
                href={`/products/${category.id}/${sib.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#002B8B]/40 hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="relative h-20 w-20 shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                  <Image
                    src={sib.image}
                    alt={sib.name}
                    fill
                    className="object-contain p-1.5 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#002B8B]">
                    <span>{sib.brand}</span>
                    <span>•</span>
                    <span>{sib.capacityLabel}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#002B8B] truncate mt-0.5">
                    {sib.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>View specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
