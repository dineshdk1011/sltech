'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SelectedItem {
  id: string;
  type: 'machine' | 'part';
  title: string;
  subtitle: string;
  category: string;
  quantity: number;
  image: string;
  meta?: Record<string, string>;
}

export interface SubmissionResult {
  refId: string;
  fullName: string;
  mobileNumber: string;
  emailId?: string;
  companyName?: string;
  state: string;
  district: string;
  branch: string;
  serviceType: string;
  requirement?: string;
  submittedAt: string;
  items: SelectedItem[];
}

interface CartContextType {
  items: SelectedItem[];
  isOpen: boolean;
  submissionResult: SubmissionResult | null;
  addItem: (item: Omit<SelectedItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearItems: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setSubmissionResult: (result: SubmissionResult | null) => void;
  hasItem: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'sllt_selected_enquiry_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items, isInitialized]);

  const addItem = (item: Omit<SelectedItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearItems = () => {
    setItems([]);
  };

  const hasItem = (id: string) => items.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        submissionResult,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
        setSubmissionResult,
        hasItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
