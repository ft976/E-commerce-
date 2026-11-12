'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function BestSellers() {
  const { setCurrentView, products } = useShop();

  // Pick top 4 best sellers from Turso database
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6 pb-2 border-b border-[#F0D3D9]/60">
        <div>
          <span className="text-xs uppercase font-semibold text-[#D98A90] tracking-widest block mb-1">
            Curated Favorites
          </span>
          <h2 className="font-playfair text-[#2E0C1B] text-2xl sm:text-3xl font-bold">
            Best Sellers
          </h2>
        </div>

        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7B1E45] hover:text-[#4A1229] transition-colors group cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
