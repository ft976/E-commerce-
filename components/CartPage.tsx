'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/cart-utils';
import { ProductSize } from '@/lib/types';
import ProductCard from './ProductCard';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  Tag,
  Check,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  Gift,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const POPULAR_COUPONS = [
  { code: 'AURELLE10', label: '10% OFF', desc: 'Flat 10% discount on your order' },
];

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartShipping,
    cartDiscount,
    cartTotal,
    cartCount,
    setCurrentView,
    couponCode,
    applyCouponCode,
    couponMessage,
    toggleWishlist,
    isInWishlist,
    showToast,
    products,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState(couponCode || 'AURELLE10');
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const shippingPercent = Math.min(100, Math.round((cartSubtotal / 999) * 100));
  const totalSavings = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.price) * item.quantity,
    0
  ) + cartDiscount;

  // Recommended complement products from Turso database
  const recommendedProducts = products.slice(0, 4);

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb: Home > Shopping Bag */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A6B74] mb-6">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#7B1E45] transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#D98A90]" />
        <span className="font-semibold text-[#7B1E45]">Shopping Bag</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#F0D3D9] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#7B1E45] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-playfair text-[#2E0C1B] text-2xl sm:text-4xl font-bold">
              Shopping Bag ({cartCount})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#8A6B74]">
            Review your selected luxury ethnic &amp; western outfits before checkout.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-[#7B1E45] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Add More Outfits</span>
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-12 text-center max-w-2xl mx-auto my-8 shadow-aurelle">
          <div className="w-20 h-20 rounded-full bg-[#FBE8EC] text-[#7B1E45] mx-auto flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#2E0C1B] mb-2">
            Your Shopping Bag is empty
          </h2>
          <p className="text-sm text-[#8A6B74] mb-8 max-w-md mx-auto">
            Explore our curated Jaipuri georgette maxi dresses, embroidered kurtis, and festive co-ord sets.
          </p>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#7B1E45] hover:bg-[#4A1229] text-white px-8 py-3.5 rounded-[6px] text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Collection</span>
          </button>
        </div>
      ) : (
        /* Main 2-Column Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Line Items Table & Gift Packaging */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gamified Free Express Delivery Bar */}
            <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-4 shadow-aurelle">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2E0C1B] mb-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#7B1E45]" />
                  {cartSubtotal >= 999
                    ? '🎉 Free Express Delivery Unlocked Across India!'
                    : `Add ${formatPrice(999 - cartSubtotal)} more for FREE Express Shipping`}
                </span>
                <span className="text-xs font-bold text-[#7B1E45] tabular-nums">{shippingPercent}%</span>
              </div>
              <div className="w-full bg-[#F0D3D9] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2E7D4F] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>

            {/* Item List Cards */}
            <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-4 sm:p-6 shadow-aurelle divide-y divide-[#F0D3D9]">
              {cart.map((item) => {
                const isWishlisted = isInWishlist(item.product.id);
                return (
                  <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    {/* 3:4 Aspect Ratio Portrait Product Image */}
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden shrink-0 border border-[#F0D3D9] bg-white shadow-2xs">
                      <Image
                        src={item.product.images[0] || '/images/dress_floral_maxi.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="112px"
                        className="object-cover object-top hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Product Details & Selectors */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1E45] bg-[#FBE8EC] px-2 py-0.5 rounded">
                            {item.product.category}
                          </span>
                          <h3 className="font-playfair text-base sm:text-lg font-bold text-[#2E0C1B] mt-1">
                            {item.product.name}
                          </h3>
                        </div>

                        {/* Line Item Total */}
                        <div className="text-right shrink-0">
                          <span className="font-bold text-base sm:text-lg text-[#7B1E45] tabular-nums block">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-[#8A6B74] block">
                              {formatPrice(item.product.price)} each
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Variant Specs: Color & Size */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8A6B74]">
                        <span className="flex items-center gap-1.5">
                          <span>Colour:</span>
                          <span className="font-semibold text-[#2E0C1B]">{item.color}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span>Size:</span>
                          <span className="font-bold text-[#7B1E45] bg-white px-2 py-0.5 rounded border border-[#F0D3D9]">
                            {item.size}
                          </span>
                        </span>
                      </div>

                      {/* Stepper + Actions Row */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        {/* Quantity Stepper */}
                        <div className="inline-flex items-center border border-[#F0D3D9] rounded-full bg-white px-2 py-1 text-xs shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity for ${item.product.name}`}
                            className="p-1 text-[#2E0C1B] hover:text-[#7B1E45] transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-[#2E0C1B] tabular-nums text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase quantity for ${item.product.name}`}
                            className="p-1 text-[#2E0C1B] hover:text-[#7B1E45] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Move to Wishlist & Remove Buttons */}
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.product.id)}
                            className="inline-flex items-center gap-1.5 text-[#8A6B74] hover:text-[#7B1E45] transition-colors cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#7B1E45] text-[#7B1E45]' : ''}`} />
                            <span>{isWishlisted ? 'Saved in Wishlist' : 'Move to Wishlist'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center gap-1.5 text-[#8A6B74] hover:text-[#7B1E45] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gift Packaging & Personalization Options */}
            <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-5 shadow-aurelle space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-5 h-5 text-[#7B1E45]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2E0C1B]">Signature Luxury Gift Packaging</h4>
                    <p className="text-xs text-[#8A6B74]">Includes Aurelle satin ribbon, royal pink box, and handwritten note.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGiftWrap}
                    onChange={(e) => {
                      setIncludeGiftWrap(e.target.checked);
                      if (e.target.checked) showToast('Added Signature Gift Box & Ribbon!', 'success');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#F0D3D9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7B1E45]" />
                </label>
              </div>

              {includeGiftWrap && (
                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Enter your personal gift message (e.g. 'Happy Birthday Priya! With love.')"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#F0D3D9] rounded-xl text-xs text-[#2E0C1B] focus:outline-none focus:ring-1 focus:ring-[#7B1E45]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Order Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
              <h2 className="font-playfair text-xl font-bold text-[#2E0C1B] mb-4 pb-3 border-b border-[#F0D3D9]">
                Order Summary
              </h2>

              {/* Price Details */}
              <div className="space-y-3 text-xs text-[#8A6B74]">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-[#2E0C1B] font-semibold tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#7B1E45]">
                    <span>Coupon Discount ({couponCode})</span>
                    <span className="font-bold tabular-nums">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#2E7D4F] font-bold">
                    {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                  </span>
                </div>

                <div className="flex justify-between text-[#8A6B74]">
                  <span>GST / Tax</span>
                  <span className="font-medium text-[#2E0C1B]">Included</span>
                </div>

                {/* Total Savings Highlight Pill */}
                {totalSavings > 0 && (
                  <div className="bg-[#EBF7EE] border border-[#2E7D4F]/20 rounded-xl p-2.5 text-center text-[11px] font-bold text-[#2E7D4F]">
                    🎉 You save {formatPrice(totalSavings)} on this order!
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-[#F0D3D9] pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#2E0C1B]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#7B1E45] tabular-nums">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Coupon Code Selector & Manual Input */}
              <div className="mt-6 pt-4 border-t border-[#F0D3D9]">
                <label className="block text-xs font-bold text-[#2E0C1B] mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#7B1E45]" />
                  <span>Apply Coupon Code</span>
                </label>

                {/* Input + Apply Button */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-white border border-[#F0D3D9] rounded-lg text-xs font-mono uppercase text-[#2E0C1B] focus:outline-none focus:ring-1 focus:ring-[#7B1E45]"
                  />
                  <button
                    onClick={() => applyCouponCode(inputCoupon)}
                    className="px-4 py-2 bg-[#7B1E45] hover:bg-[#4A1229] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponMessage && (
                  <p className="text-[11px] text-[#2E7D4F] font-semibold mb-3 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {couponMessage}
                  </p>
                )}

                {/* Popular Coupons Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8A6B74] uppercase tracking-wider font-bold block">Available Offers:</span>
                  {POPULAR_COUPONS.map((cp) => (
                    <button
                      key={cp.code}
                      onClick={() => {
                        setInputCoupon(cp.code);
                        applyCouponCode(cp.code);
                      }}
                      className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        couponCode === cp.code
                          ? 'border-[#7B1E45] bg-[#FBE8EC] font-semibold'
                          : 'border-[#F0D3D9] bg-white hover:border-[#7B1E45]'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-[#7B1E45]">{cp.code}</span>
                        <span className="text-[10px] text-[#8A6B74] block">{cp.desc}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-[#7B1E45] text-white px-1.5 py-0.5 rounded">
                        {cp.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Burgundy CTA Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full mt-6 bg-[#7B1E45] hover:bg-[#4A1229] text-white py-4 px-4 rounded-[6px] text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Strip */}
              <div className="mt-6 pt-4 border-t border-[#F0D3D9] grid grid-cols-3 gap-2 text-center text-[10px] text-[#8A6B74]">
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-[#7B1E45] mb-1" />
                  <span className="font-semibold text-[#2E0C1B]">7-Day Returns</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D4F] mb-1" />
                  <span className="font-semibold text-[#2E0C1B]">100% Jaipur</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-[#7B1E45] mb-1" />
                  <span className="font-semibold text-[#2E0C1B]">Free Express</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Your Style Section */}
      {cart.length > 0 && (
        <section className="mt-16 pt-8 border-t border-[#F0D3D9]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-playfair text-[#2E0C1B] text-2xl font-bold">
                You Might Also Love
              </h2>
              <p className="text-xs text-[#8A6B74]">Handpicked recommendations matching your bag selection</p>
            </div>
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#7B1E45] hover:underline"
            >
              View All Outfits →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
