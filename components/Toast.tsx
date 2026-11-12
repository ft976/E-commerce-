'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { CheckCircle2, Info } from 'lucide-react';

export default function Toast() {
  const { toasts } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#2E0C1B] text-white px-4 py-3 rounded-xl shadow-aurelle-lg border border-[#7B1E45] flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#2E7D4F] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#D98A90] shrink-0" />
          )}
          <span className="text-xs font-medium leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
