'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/cart-utils';
import { Heart, ShoppingBag, Trash2, ChevronRight, Sparkles, Star } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setCurrentView, openProduct, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb: Home > Wishlist */}
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
        <span className="font-semibold text-[#7B1E45]">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#F0D3D9] mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#7B1E45] text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <h1 className="font-playfair text-[#2E0C1B] text-2xl sm:text-4xl font-bold">
              My Saved Outfits ({wishlist.length})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#8A6B74]">
            Your personal collection of liked outfits. Add them to your bag or review details.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-[#7B1E45] hover:underline cursor-pointer"
          >
            + Explore More Dresses
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-12 text-center max-w-2xl mx-auto my-8 shadow-aurelle">
          <div className="w-20 h-20 rounded-full bg-[#FBE8EC] text-[#7B1E45] mx-auto flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 fill-[#D98A90] text-[#7B1E45]" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#2E0C1B] mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-sm text-[#8A6B74] mb-8 max-w-md mx-auto">
            Save your favorite Jaipuri georgette maxi dresses, kurtis, and co-ord sets by tapping the heart icon on any outfit.
          </p>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-[#7B1E45] hover:bg-[#4A1229] text-white px-8 py-3.5 rounded-[6px] text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Outfits</span>
          </button>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-3 shadow-aurelle hover:shadow-aurelle-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div
                onClick={() => openProduct(product.id)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#FBE8EC] cursor-pointer mb-3"
              >
                <Image
                  src={product.images[0] || '/images/dress_floral_maxi.jpg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Remove from Wishlist button top-right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  title="Remove from wishlist"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-[#7B1E45] flex items-center justify-center shadow-xs hover:bg-[#7B1E45] hover:text-white transition-all cursor-pointer z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Discount Badge */}
                {product.discountPercent && (
                  <span className="absolute top-2.5 left-2.5 bg-[#FFF6F7]/95 text-[#7B1E45] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8A6B74] mb-1">
                    <span className="uppercase tracking-wider font-semibold text-[10px] text-[#7B1E45]">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-[#F5A623]">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[#2E0C1B] font-bold">{product.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => openProduct(product.id)}
                    className="font-playfair text-base font-bold text-[#2E0C1B] hover:text-[#7B1E45] transition-colors cursor-pointer line-clamp-1 mb-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-[#7B1E45] text-base tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-[#8A6B74] line-through tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* Move to Bag CTA Button */}
                <button
                  onClick={() => addToCart(product, 'M', product.colors[0]?.name || 'Standard', 1)}
                  className="w-full bg-[#7B1E45] hover:bg-[#4A1229] text-white py-2.5 px-3 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
