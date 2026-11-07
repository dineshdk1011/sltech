'use client';

import Image from 'next/image';
import { Manrope } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BriefcaseBusiness,
  Briefcase,
  ClipboardCheck,
  Factory,
  Home,
  Info,
  Layers,
  Menu,
  Package,
  Phone,
  Power,
  Wrench,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { headerListType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useCurrentUser } from './UserContext';
import { useCart } from './CartContext';

const headersList: headerListType[] = [
  { id: 1, name: 'Home', path: '/' },
  { id: 2, name: 'Machines & Spares', path: '/#machines-section' },
  { id: 3, name: 'Services', path: '/services' },
  { id: 4, name: 'Brands', path: '/brands' },
  { id: 5, name: 'About Us', path: '/about-us' },
  { id: 6, name: 'Contact', path: '/contact' },
];

const enquiryHeader: headerListType = {
  id: 7,
  name: 'Enquiries',
  path: '/admin/enquiries',
};

const serviceReportHeader: headerListType = {
  id: 8,
  name: 'Service Reports',
  path: '/service-report',
};

const manrope = Manrope({ subsets: ['latin'] });

const headerIcons: Record<string, LucideIcon> = {
  Home,
  'Machines & Spares': Layers,
  'About Us': Info,
  Services: Wrench,
  Brands: Factory,
  Careers: Briefcase,
  Contact: Phone,
  Enquiries: BriefcaseBusiness,
  'Service Reports': ClipboardCheck,
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, openDrawer } = useCart();
  const {
    authUser,
    allowedUser,
    allowedUserError,
    name: engineerName,
    email: engineerEmail,
  } = useCurrentUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthorized = Boolean(
    authUser &&
    allowedUser &&
    !allowedUserError &&
    (allowedUser.is_active === true ||
      String(allowedUser.is_active).toLowerCase() === 'true'),
  );

  const visibleHeaders = isAuthorized
    ? [...headersList, enquiryHeader, serviceReportHeader]
    : headersList;

  const handleLogout = async (): Promise<void> => {
    await createClient().auth.signOut();
    setMenuOpen(false);
    router.replace('/login');
    router.refresh();
  };

  const engineerInitials =
    engineerName
      ?.trim()
      .split(/\s+/)
      .map((name) => name.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EN';

  return (
    <header className={`${manrope.className} sticky top-2 sm:top-3 z-40 mb-4 sm:mb-6`}>
      {/* =========================================================
          SLEEK MODERN NAVBAR CONTAINER
      ========================================================= */}
      <div className="relative mx-auto flex h-16 sm:h-[72px] w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 sm:px-6 shadow-[0_8px_30px_rgba(0,43,139,0.06)] backdrop-blur-xl">
        {/* =======================================================
            LOGO (PROMINENT & CRISP)
        ======================================================= */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="group inline-flex items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1268D8]"
          >
            <Image
              src="/SL-Logo.png"
              alt="SL Laundry Tech"
              width={220}
              height={56}
              priority
              className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* =======================================================
            DESKTOP NAVIGATION LINKS (CLEAN, NO ICONS, NO WRAP)
        ======================================================= */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center justify-center shrink-0">
          <ul className="flex items-center gap-1 xl:gap-2">
            {visibleHeaders.map((header) => {
              const isActive =
                pathname === header.path ||
                (header.path !== '/' && pathname.startsWith(`${header.path}/`));

              return (
                <li key={header.id}>
                  <Link
                    href={header.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition-all duration-150 rounded-xl ${
                      isActive
                        ? 'bg-[#002B8B] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#002B8B]'
                    }`}
                  >
                    <span>{header.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* =======================================================
            RIGHT ACTIONS: HOTLINE, BASKET & MOBILE TOGGLE
        ======================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Direct Hotline Quick Pill (Desktop XL) */}
          <a
            href="tel:+919361624107"
            className="hidden xl:inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-200 hover:text-[#002B8B] px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors whitespace-nowrap"
            title="Call Senior Laundry Engineer"
          >
            <div className="h-6 w-6 rounded-full bg-blue-100/80 text-[#002B8B] flex items-center justify-center shrink-0">
              <Phone className="w-3 h-3" />
            </div>
            <span className="whitespace-nowrap">+91 93616 24107</span>
          </a>

          {/* Quotation Basket Button */}
          {!isAuthorized && (
            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#002B8B] to-[#1268D8] hover:from-[#002477] hover:to-[#0f5ec4] text-white font-bold text-xs sm:text-sm px-4 py-2.5 shadow-md shadow-blue-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Package className="h-4 w-4 text-cyan-300 shrink-0" />
              <span className="whitespace-nowrap">Quote</span>
              {items.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[11px] font-black text-white shadow-xs shrink-0">
                  {items.length}
                </span>
              )}
            </button>
          )}

          {/* Logged in Engineer profile */}
          {isAuthorized && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
              <div
                className="flex items-center gap-2 text-xs"
                title={engineerEmail || ''}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#002B8B] font-extrabold border border-blue-200 text-xs shadow-xs shrink-0">
                  {engineerInitials}
                </span>
                <span className="hidden sm:inline font-bold text-slate-700 max-w-[100px] truncate whitespace-nowrap">
                  {engineerName}
                </span>
              </div>

              <button
                type="button"
                aria-label="Logout"
                onClick={() => void handleLogout()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer shrink-0"
                title="Logout"
              >
                <Power className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-[#002B8B] hover:text-[#002B8B] transition-colors lg:hidden cursor-pointer shrink-0"
          >
            {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE NAVIGATION DROPDOWN
      ========================================================= */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mt-2 w-full rounded-2xl border border-slate-200/90 bg-white/98 p-4 shadow-xl backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <ul className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            {visibleHeaders.map((header) => {
              const Icon = headerIcons[header.name];
              const isActive =
                pathname === header.path ||
                (header.path !== '/' && pathname.startsWith(`${header.path}/`));

              return (
                <li key={header.id}>
                  <Link
                    href={header.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#002B8B] text-white font-bold'
                        : 'hover:bg-slate-50 hover:text-[#002B8B]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span>{header.name}</span>
                  </Link>
                </li>
              );
            })}

            {/* Mobile Quote / Basket Button */}
            {!isAuthorized && (
              <li className="mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openDrawer();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 bg-gradient-to-r from-[#002B8B] to-[#1268D8] text-white font-bold text-sm shadow-md shadow-blue-900/15 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-cyan-300" />
                  <span>
                    {items.length > 0
                      ? `Quotation Basket (${items.length} items)`
                      : 'Open Quotation Basket'}
                  </span>
                </button>
              </li>
            )}

            {/* Mobile Logged-in Profile if authorized */}
            {isAuthorized && (
              <li className="pt-1">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[#002B8B] font-extrabold text-[10px]">
                      {engineerInitials}
                    </span>
                    <span className="font-bold text-slate-800">{engineerName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    className="flex items-center gap-1 text-red-600 font-bold hover:underline"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </li>
            )}

            {/* Mobile Hotline Quick Action */}
            <li className="pt-1">
              <a
                href="tel:+919361624107"
                className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500 font-semibold hover:text-[#002B8B]"
              >
                <Phone className="w-3.5 h-3.5 text-[#002B8B]" />
                <span>Call Hotline: +91 93616 24107</span>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}