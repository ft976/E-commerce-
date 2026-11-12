'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Home, ShoppingBag, User, Sparkles, Heart } from 'lucide-react';

export default function MobileBottomNav() {
  const { currentView, setCurrentView, cartCount, wishlist } = useShop();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Dresses', icon: Sparkles },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'cart', label: 'Bag', icon: ShoppingBag, badge: cartCount },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 bg-[#FFF6F7]/95 backdrop-blur-md border-t border-[#F0D3D9] z-40 py-2 px-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as typeof currentView);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center py-1 px-3 transition-colors cursor-pointer ${
                isActive ? 'text-[#7B1E45] font-bold' : 'text-[#8A6B74] hover:text-[#2E0C1B]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#7B1E45]' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#7B1E45] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


