'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';

export default function NotFound() {
  const { setCurrentView } = useShop();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBE8EC] p-4 text-center">
      <h1 className="font-playfair text-6xl font-bold text-[#7B1E45] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[#2E0C1B] mb-2">Page Not Found</h2>
      <p className="text-[#8A6B74] mb-8 max-w-md">
        The outfit you're looking for might have moved or is temporarily unavailable.
      </p>
      <button
        onClick={() => {
          setCurrentView('home');
          window.location.href = '/';
        }}
        className="bg-[#7B1E45] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#4A1229] transition-colors cursor-pointer"
      >
        Back to Aurelle Home
      </button>
    </div>
  );
}
