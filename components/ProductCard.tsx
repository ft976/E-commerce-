'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { formatPrice } from '@/lib/cart-utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, openProduct, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  // Total quantity of this item currently added to the cart
  const inCartCount = cart
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleCardClick = () => {
    openProduct(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 'M', product.colors[0]?.name || 'Standard', 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#FFF6F7] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-[#F0D3D9] shadow-aurelle hover:shadow-aurelle-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* 3:4 Aspect Ratio Portrait Image Container */}
      <div className="relative w-full aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-[#FBE8EC]">
        {/* Skeleton loader placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBE8EC] via-[#F8DBE1] to-[#FBE8EC] animate-pulse" />
        )}

        <Image
          src={product.images[0] || '/images/dress_floral_maxi.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Heart Icon in White Circle at Top-Right */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs text-[#2E0C1B] hover:text-[#7B1E45] transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#7B1E45] text-[#7B1E45]' : 'text-[#8A6B74] hover:text-[#7B1E45]'
            }`}
          />
        </button>

        {/* In Bag Quantity Badge "+1 in Bag" at Top-Left */}
        {inCartCount > 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-[#7B1E45] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-10 animate-fade-in">
            <ShoppingBag className="w-3 h-3 text-white" />
            <span>+{inCartCount} in Bag</span>
          </span>
        ) : product.discountPercent ? (
          <span className="absolute top-2.5 left-2.5 bg-[#FFF6F7]/90 text-[#7B1E45] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs shadow-2xs">
            {product.discountPercent}% OFF
          </span>
        ) : null}

        {/* Hover Quick Add to Bag Button (Desktop) & Touch Quick Add (Mobile) */}
        <div className="hidden sm:block absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            className={`w-full text-white py-2.5 px-3 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md active:scale-98 cursor-pointer transition-colors ${
              inCartCount > 0 ? 'bg-[#4A1229] hover:bg-[#7B1E45]' : 'bg-[#7B1E45] hover:bg-[#4A1229]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{inCartCount > 0 ? `+${inCartCount} in Bag (Add More)` : 'Quick Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-1 px-1 flex flex-col flex-1">
        {/* Category tag & Available Colors */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8A6B74] font-medium">
            {product.category}
          </span>
          {/* Subtle color dots indicator */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-2 h-2 rounded-full border border-black/10 inline-block"
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-[#8A6B74]">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-serif text-[#2E0C1B] text-sm sm:text-base font-semibold group-hover:text-[#7B1E45] transition-colors line-clamp-1 mb-1">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-bold text-[#7B1E45] text-base sm:text-lg tabular-nums">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-[#8A6B74] line-through tabular-nums">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Bottom row: Star Rating & Mobile Quick Add */}
        <div className="mt-auto flex items-center justify-between gap-1 pt-1 border-t border-[#F0D3D9]/50">
          <div className="flex items-center gap-1.5 text-xs text-[#8A6B74]">
            <div className="flex items-center text-[#F5A623]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-[#2E0C1B] text-xs">{product.rating}</span>
            <span className="text-[10px]">({(product.reviewCount / 1000).toFixed(1)}k)</span>
          </div>

          {/* Mobile direct Add button with +count badge */}
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="sm:hidden px-2 py-1 bg-[#7B1E45] text-white text-[11px] font-bold rounded-full hover:bg-[#4A1229] transition-all active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 text-white" />
            <span>{inCartCount > 0 ? `+${inCartCount}` : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
