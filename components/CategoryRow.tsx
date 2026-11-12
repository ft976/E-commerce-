'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { CATEGORIES_DATA } from '@/lib/data';

export default function CategoryRow() {
  const { setCurrentView, setFilters, collections } = useShop();

  const displayCategories =
    collections && collections.length > 0
      ? collections.map((c) => ({ id: c.id, name: c.title, image: c.image, category: c.linkCategory }))
      : CATEGORIES_DATA.map((c) => ({ id: c.id, name: c.name, image: c.image, category: c.name }));

  const handleSelectCategory = (catName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: [catName],
    }));
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8A6B74]">
          Explore Collections
        </h3>
        <span className="text-xs text-[#7B1E45] font-medium hidden sm:inline">
          Handcrafted Silhouettes
        </span>
      </div>

      {/* Horizontally scrollable container on mobile */}
      <div className="flex items-center justify-start md:justify-between gap-6 sm:gap-8 overflow-x-auto pb-4 pt-1 scrollbar-none px-1">
        {displayCategories.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectCategory(item.name)}
            className="flex flex-col items-center gap-2.5 group shrink-0 focus-visible:outline-[#7B1E45]"
          >
            {/* 64-72px circular image with soft border and shadow */}
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden p-0.5 border-2 border-[#F0D3D9] group-hover:border-[#7B1E45] shadow-aurelle transition-all duration-300 group-hover:scale-105 bg-white">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="72px"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Label below */}
            <span className="text-xs sm:text-sm font-medium text-[#2E0C1B] group-hover:text-[#7B1E45] transition-colors whitespace-nowrap">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
