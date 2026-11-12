'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryRow from '@/components/CategoryRow';
import BestSellers from '@/components/BestSellers';
import ProductListingPage from '@/components/ProductListingPage';
import ProductDetailPage from '@/components/ProductDetailPage';
import CartPage from '@/components/CartPage';
import WishlistPage from '@/components/WishlistPage';
import CheckoutPage from '@/components/CheckoutPage';
import AccountPage from '@/components/AccountPage';
import Footer from '@/components/Footer';
import SizeGuideModal from '@/components/SizeGuideModal';
import AuthModal from '@/components/AuthModal';
import Toast from '@/components/Toast';
import MobileBottomNav from '@/components/MobileBottomNav';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function StorefrontContent() {
  const { currentView, setCurrentView } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FBE8EC] via-[#FCEFF2] to-[#F7D9DF] text-[#2E0C1B] pb-16 sm:pb-0">
      {/* Sticky Global Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <CategoryRow />
            <BestSellers />

            {/* Editorial Brand Spotlight: Indian Ethnic & Western Fusion */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-8">
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#FFF6F7] border border-[#F0D3D9] p-6 sm:p-10 md:p-12 shadow-aurelle">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <span className="text-xs uppercase font-bold text-[#7B1E45] tracking-widest inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D98A90]" />
                      Craftsmanship &amp; Heritage
                    </span>
                    <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-[#2E0C1B] leading-tight">
                      Where Indian Traditions Meet Contemporary Silhouettes
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8A6B74] leading-relaxed">
                      Every Aurelle outfit tells a story of refined femininity. From delicate hand-spun Jaipur georgettes and festive zardozi embroidery to breezy weekend maxi dresses, we celebrate the modern woman who embraces both timeless heritage and effortless contemporary style.
                    </p>
                    <div className="pt-2 flex items-center gap-4">
                      <button
                        onClick={() => {
                          setCurrentView('shop');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#7B1E45] hover:bg-[#4A1229] text-white text-xs font-semibold px-6 py-3 rounded-[6px] shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        <span>Explore All Outfits</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 relative h-60 sm:h-80 rounded-xl overflow-hidden border border-[#F0D3D9]">
                    <Image
                      src="/images/ethnic_kurti_cream.jpg"
                      alt="Artisanal Indian ethnic attire"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'shop' && <ProductListingPage />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'account' && <AccountPage />}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <SizeGuideModal />
      <Toast />

      {/* Mobile Sticky Bottom Nav Bar */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
