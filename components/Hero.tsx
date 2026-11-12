'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const { setCurrentView, banners } = useShop();
  const banner = banners?.[0];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Rounded Hero Container with blush gradient */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#FBE8EC] via-[#F8DBE1] to-[#F3C8D2] border border-[#F0D3D9] shadow-aurelle">
        {/* Floral Blossom Branch Illustration (Top-Right) */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-40 md:opacity-75 z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M300 20C240 30 190 70 170 120C155 160 160 200 130 230C100 260 50 280 0 300"
              stroke="#D98A90"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M210 90C190 70 160 65 140 70"
              stroke="#D98A90"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M165 140C140 130 120 135 105 145"
              stroke="#D98A90"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Blossom Petals */}
            <circle cx="210" cy="90" r="10" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
            <circle cx="210" cy="90" r="4" fill="#D98A90" />
            <circle cx="140" cy="70" r="12" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
            <circle cx="140" cy="70" r="5" fill="#7B1E45" />
            <circle cx="165" cy="140" r="11" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
            <circle cx="165" cy="140" r="4" fill="#D98A90" />
            <circle cx="105" cy="145" r="9" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
            <circle cx="105" cy="145" r="3.5" fill="#7B1E45" />
            <circle cx="130" cy="230" r="13" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
            <circle cx="130" cy="230" r="5" fill="#7B1E45" />
            {/* Soft Petals falling */}
            <ellipse cx="250" cy="120" rx="6" ry="10" transform="rotate(25 250 120)" fill="#D98A90" fillOpacity="0.4" />
            <ellipse cx="180" cy="190" rx="5" ry="8" transform="rotate(-35 180 190)" fill="#D98A90" fillOpacity="0.3" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] md:min-h-[520px]">
          {/* Left Column: Headline, Subtitle, CTA */}
          <div className="lg:col-span-6 px-6 sm:px-10 md:px-14 py-12 md:py-16 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF6F7] border border-[#F0D3D9] text-[#7B1E45] text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D98A90]" />
              Festive &amp; Summer Lookbook 2025
            </div>

            <h1 className="font-playfair text-[#2E0C1B] text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight leading-[1.05] mb-4 text-balance">
              {banner?.title ? (
                <>
                  {banner.title.split(' ').slice(0, -2).join(' ')}<br />
                  <span className="italic font-normal text-[#7B1E45]">{banner.title.split(' ').slice(-2).join(' ')}</span>
                </>
              ) : (
                <>
                  New Season<br />
                  <span className="italic font-normal text-[#7B1E45]">New You</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-[#8A6B74] font-medium tracking-wide mb-8">
              {banner?.subtitle || 'Elegant. Ethnic. Effortless.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  setCurrentView((banner?.ctaLink as any) || 'shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#7B1E45] hover:bg-[#4A1229] text-white text-sm sm:text-base font-semibold px-7 py-3.5 rounded-[6px] shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <span>{banner?.ctaText || 'Shop the Collection'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#7B1E45] hover:text-[#4A1229] border border-[#D98A90] hover:border-[#7B1E45] bg-[#FFF6F7]/60 hover:bg-[#FFF6F7] px-6 py-3.5 rounded-[6px] transition-all cursor-pointer"
              >
                <span>Explore Dresses</span>
              </button>
            </div>

            {/* Quick Highlights & Social Proof */}
            <div className="mt-8 pt-6 border-t border-[#F0D3D9]/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#8A6B74]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#2E7D4F]">✓</span> 100% Breathable Silks &amp; Cottons
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="text-[#2E7D4F]">✓</span> Handcrafted Karigar Embroidery
              </span>
              <span className="flex items-center gap-1.5 font-medium text-[#7B1E45]">
                <span className="text-[#D98A90]">★</span> 50,000+ Orders Delivered
              </span>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[460px] md:h-[520px] w-full flex items-end justify-center lg:justify-end overflow-hidden">
            <div className="relative w-full h-full max-w-[480px]">
              {/* Soft Gradient Overlay fading softly into background */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8DBE1] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#F8DBE1] lg:via-transparent lg:to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#F8DBE1] to-transparent z-10 pointer-events-none" />

              <Image
                src={banner?.image || "/images/hero_maroon_kurta.jpg"}
                alt={banner?.title || "Hero banner"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top filter contrast-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
