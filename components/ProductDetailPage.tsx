'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ProductSize } from '@/lib/types';
import { formatPrice } from '@/lib/cart-utils';
import {
  Star,
  Ruler,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductDetailPage() {
  const {
    cart,
    selectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    products,
  } = useShop();

  // Find product or fallback
  const product =
    products.find((p) => p.id === selectedProductId) ||
    products.find((p) => p.id === 'floral-maxi-dress') ||
    products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.name || 'Burgundy'
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) return <div className="p-12 text-center font-playfair">Product loading...</div>;

  const isWishlisted = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, 1);
  };

  // Complete the Look outfits from products database
  const completeTheLookProducts = products.filter(
    (p) => p.id !== product.id
  ).slice(0, 3);

  // 5 thumbnails
  const thumbnails = product.images.length >= 5 ? product.images.slice(0, 5) : [
    product.images[0] || '/images/dress_floral_maxi.jpg',
    '/images/dress_tiered.jpg',
    '/images/dress_solid_midi.jpg',
    '/images/dress_printed.jpg',
    '/images/dress_shirt.jpg',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb: Home > Dresses > Product Name */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A6B74] mb-6 flex-wrap">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#7B1E45] transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#D98A90]" />
        <button
          onClick={() => {
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#7B1E45] transition-colors"
        >
          Dresses
        </button>
        <ChevronRight className="w-3 h-3 text-[#D98A90]" />
        <span className="font-semibold text-[#7B1E45]">{product.name}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16">
        {/* Left Column: Vertical Thumbnails Strip + Large 4:5 Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnail Strip (5 Thumbs) */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-white shadow-2xs ${
                  activeImageIndex === idx
                    ? 'border-[#7B1E45] ring-2 ring-[#7B1E45]/20 scale-102'
                    : 'border-[#F0D3D9] hover:border-[#D98A90] opacity-80 hover:opacity-100'
                }`}
              >
                <Image
                  src={thumb}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Large Rounded Main Image (4:5) with Zoom on Hover */}
          <div
            className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFF6F7] border border-[#F0D3D9] shadow-aurelle cursor-crosshair select-none"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={thumbnails[activeImageIndex] || thumbnails[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={`object-cover object-top transition-transform duration-200 ease-out ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
              referrerPolicy="no-referrer"
            />

            {/* Quick hover instruction pill */}
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-xs pointer-events-none opacity-80 hidden sm:block">
              Hover to Zoom
            </div>
          </div>
        </div>

        {/* Right Column: Title, Price, Rating, Description, Swatches, Sizes, CTA, Trust */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          {/* 1. Title (Playfair, 28px) */}
          <h1 className="font-playfair text-[#2E0C1B] text-2xl sm:text-[28px] font-bold leading-tight mb-2">
            {product.name}
          </h1>

          {/* 2. Price Row */}
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-bold text-[#7B1E45] text-2xl sm:text-3xl tabular-nums">
              {formatPrice(product.price)}
            </span>
            <span className="text-base text-[#8A6B74] line-through tabular-nums">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs font-bold text-[#D98A90] bg-[#FFF6F7] border border-[#F0D3D9] px-2 py-0.5 rounded">
              (20% OFF)
            </span>
          </div>

          {/* 3. Rating: 5 gold stars, "4.6 (12K reviews)" */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#F0D3D9]">
            <div className="flex items-center text-[#F5A623]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#2E0C1B]">4.6</span>
            <span className="text-xs text-[#8A6B74]">(12K reviews)</span>
            <span className="text-xs text-[#2E7D4F] font-medium ml-2">✓ Verified Buyer Favorite</span>
          </div>

          {/* 4. Description */}
          <p className="text-sm text-[#8A6B74] leading-relaxed mb-6 font-normal">
            A flowy floral maxi dress perfect for brunches, vacations and casual outings.
          </p>

          {/* 5. Colour Label plus 5 circular swatches (burgundy selected with a ring, white, rose, blue, purple) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#2E0C1B] uppercase tracking-wide">
                Colour: <span className="text-[#7B1E45] normal-case">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { name: 'Burgundy', hex: '#7B1E45' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Rose', hex: '#D98A90' },
                { name: 'Blue', hex: '#4A7C9B' },
                { name: 'Purple', hex: '#7E5283' },
              ].map((c) => {
                const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={`Select color ${c.name}`}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border border-black/15 transition-transform hover:scale-110 flex items-center justify-center ${
                      isSelected ? 'ring-2 ring-[#7B1E45] ring-offset-2 scale-110 shadow-xs' : ''
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 6. Size Label plus boxes XS S M L XL XXL with "Size Guide" link and ruler icon */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#2E0C1B] uppercase tracking-wide">
                Size: <span className="text-[#7B1E45] font-bold">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-[#7B1E45] hover:text-[#4A1229] underline font-medium cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as ProductSize[]).map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 rounded-[6px] border text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#7B1E45] bg-[#7B1E45] text-white shadow-xs'
                        : 'border-[#F0D3D9] bg-white text-[#2E0C1B] hover:border-[#7B1E45] hover:text-[#7B1E45]'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Scarcity & Fast Dispatch Alert */}
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#7B1E45] bg-[#FBE8EC] p-2.5 rounded-lg border border-[#F0D3D9]">
            <span className="w-2 h-2 rounded-full bg-[#7B1E45] animate-pulse" />
            <span>High Demand: Only 3 pieces left in size {selectedSize} • Dispatches in 24 hours</span>
          </div>

          {/* 7. Row: full-width burgundy "Add to Bag" button + square outlined heart button */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 bg-[#7B1E45] hover:bg-[#4A1229] text-white py-3.5 px-6 rounded-[6px] text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cart.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0) > 0 ? `+${cart.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0)} in Bag (Add More)` : 'Add to Bag'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className={`w-12 h-12 rounded-[6px] border flex items-center justify-center transition-colors shadow-2xs ${
                isWishlisted
                  ? 'border-[#7B1E45] bg-[#FFF6F7] text-[#7B1E45]'
                  : 'border-[#D98A90] text-[#7B1E45] hover:border-[#7B1E45] bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#7B1E45]' : ''}`} />
            </button>
          </div>

          {/* 8. Trust strip in a bordered rounded box with 3 columns */}
          <div className="border border-[#F0D3D9] rounded-xl bg-[#FFF6F7] p-4 grid grid-cols-3 divide-x divide-[#F0D3D9] text-center shadow-2xs mb-6">
            <div className="flex flex-col items-center px-2">
              <Truck className="w-5 h-5 text-[#7B1E45] mb-1" />
              <span className="text-[11px] font-bold text-[#2E0C1B]">Free Shipping</span>
              <span className="text-[10px] text-[#8A6B74]">Above ₹999</span>
            </div>

            <div className="flex flex-col items-center px-2">
              <RotateCcw className="w-5 h-5 text-[#7B1E45] mb-1" />
              <span className="text-[11px] font-bold text-[#2E0C1B]">Easy Returns</span>
              <span className="text-[10px] text-[#8A6B74]">Within 7 Days</span>
            </div>

            <div className="flex flex-col items-center px-2">
              <ShieldCheck className="w-5 h-5 text-[#7B1E45] mb-1" />
              <span className="text-[11px] font-bold text-[#2E0C1B]">Secure Payments</span>
              <span className="text-[10px] text-[#8A6B74]">100% Secure</span>
            </div>
          </div>

          {/* Fabric & Fit Details */}
          <div className="border-t border-[#F0D3D9] pt-4 space-y-3 text-xs text-[#8A6B74]">
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2E0C1B] w-24 shrink-0">Fabric &amp; Care:</span>
              <span>Lightweight breathable Jaipuri viscose-georgette with cotton voile lining. Dry clean or gentle cold hand wash.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2E0C1B] w-24 shrink-0">Fit &amp; Sizing:</span>
              <span>True to standard Indian sizing. Model is 5&apos;8&quot; wearing size Small (S). Bust 34&quot;, Waist 26&quot;.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#2E0C1B] w-24 shrink-0">Dispatch:</span>
              <span>Ships within 24-48 hours with door-to-door courier tracking across India &amp; Worldwide.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look Section */}
      <section className="pt-8 border-t border-[#F0D3D9]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-[#2E0C1B] text-2xl font-bold">
            Complete the Look
          </h2>
          <span className="text-xs text-[#8A6B74]">Handpicked pairings by Aurelle stylists</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {completeTheLookProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
