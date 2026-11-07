'use client';

import React from 'react';
import { useCart } from './CartContext';
import { Package } from 'lucide-react';

export default function EnquireButton({ className = '' }: { className?: string }) {
  const { items, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`group inline-flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] px-5 text-[13px] font-bold text-white shadow-[0_7px_20px_rgba(0,43,139,0.24)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_10px_25px_rgba(18,104,216,0.32)] active:translate-y-0 active:scale-[0.98] cursor-pointer xl:px-6 xl:text-sm ${className}`}
    >
      <Package className="w-4 h-4 text-cyan-300" />
      <span>{items.length > 0 ? `Enquiry Quote (${items.length})` : 'Enquire Now'}</span>
      <span className="text-base transition-transform duration-300 ease-out group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}