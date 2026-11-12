import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/lib/data';
import { formatPrice } from '@/lib/cart-utils';
import { Search, Heart, ShoppingBag, User, ChevronLeft, ChevronRight, Menu, X, Sparkles, Copy, Check } from 'lucide-react';

const ANNOUNCEMENTS = [
  'Free Shipping on orders above ₹999 | Code: AURELLE10',
  'New Season Festive Edits Live | Handcrafted Silhouettes',
  'Easy 7-Day Hassle-Free Returns & Exchanges Across India',
];

export default function Header() {
  const {
    user,
    logoutUser,
    setIsAuthModalOpen,
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    openProduct,
    showToast,
    applyCouponCode,
  } = useShop();

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1));
  };

  const handleNextAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const handleNavClick = (view: 'home' | 'shop' | 'cart' | 'wishlist' | 'account') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (code: string) => {
    applyCouponCode(code);
    navigator?.clipboard?.writeText(code);
    showToast(`Code ${code} copied & applied to your bag! 10% OFF`, 'success');
  };

  const matchingProducts = searchQuery.trim().length > 0
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full shadow-aurelle">
      {/* 1. Announcement Bar */}
      <div className="bg-[#4A1229] text-white text-[11px] py-1.5 px-4 flex items-center justify-between font-normal tracking-wide">
        <button
          onClick={handlePrevAnnouncement}
          aria-label="Previous Announcement"
          className="p-1 hover:opacity-80 transition-opacity flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="text-center font-medium transition-all duration-300 truncate max-w-[85%] sm:max-w-none flex items-center justify-center gap-2">
          <span>{ANNOUNCEMENTS[announcementIndex]}</span>
          {announcementIndex === 0 && (
            <button
              onClick={() => handleCopyCode('AURELLE10')}
              className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer"
              title="Click to copy and apply code"
            >
              <Copy className="w-3 h-3" />
              <span>Tap to Apply</span>
            </button>
          )}
        </div>

        <button
          onClick={handleNextAnnouncement}
          aria-label="Next Announcement"
          className="p-1 hover:opacity-80 transition-opacity flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Navbar */}
      <nav className="bg-[#FFF6F7]/95 backdrop-blur-md border-b border-[#F0D3D9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#2E0C1B] hover:text-[#7B1E45] rounded-md focus-visible:outline-[#7B1E45]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
              className="p-2 text-[#2E0C1B] hover:text-[#7B1E45] rounded-md sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo (Burgundy circle with white serif A + wordmark + tagline) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus-visible:outline-[#7B1E45] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#7B1E45] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm transition-transform group-hover:scale-105">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#2E0C1B] leading-tight">
                AURELLE
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8A6B74] tracking-normal font-sans">
                Wear your mood. Own your style.
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`relative py-1 transition-colors hover:text-[#7B1E45] ${
                currentView === 'home'
                  ? 'text-[#7B1E45] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#7B1E45]'
                  : 'text-[#2E0C1B]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`relative py-1 transition-colors hover:text-[#7B1E45] ${
                currentView === 'shop'
                  ? 'text-[#7B1E45] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#7B1E45]'
                  : 'text-[#2E0C1B]'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="py-1 text-[#2E0C1B] hover:text-[#7B1E45] transition-colors"
            >
              Collections
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="py-1 text-[#2E0C1B] hover:text-[#7B1E45] transition-colors flex items-center gap-1"
            >
              Sale
              <span className="text-[10px] text-[#7B1E45] bg-[#FBE8EC] px-1.5 py-0.2 rounded font-bold">20% OFF</span>
            </button>
            <button
              onClick={() => handleNavClick('cart')}
              className={`relative py-1 transition-colors hover:text-[#7B1E45] ${
                currentView === 'cart'
                  ? 'text-[#7B1E45] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#7B1E45]'
                  : 'text-[#2E0C1B]'
              }`}
            >
              Shopping Bag {cartCount > 0 ? `(${cartCount})` : ''}
            </button>
            <button
              onClick={() => handleNavClick('home')}
              className="py-1 text-[#2E0C1B] hover:text-[#7B1E45] transition-colors"
            >
              About
            </button>
          </div>

          {/* Right Action Zone: Search pill + User, Wishlist, Bag icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill Input with Live Preview Dropdown */}
            <div ref={searchContainerRef} className="relative hidden sm:block w-48 md:w-60 lg:w-72">
              <Search className="w-4 h-4 text-[#8A6B74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for outfits..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white text-[#2E0C1B] placeholder-[#8A6B74] rounded-full border border-[#F0D3D9] focus:outline-none focus:ring-1 focus:ring-[#7B1E45] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A6B74] hover:text-[#2E0C1B] cursor-pointer"
                >
                  ✕
                </button>
              )}

              {/* Live Search Suggestions Dropdown */}
              {isSearchFocused && matchingProducts.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-[#F0D3D9] shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="text-[10px] uppercase font-bold text-[#8A6B74] px-2 py-1">
                    Matching Outfits ({matchingProducts.length})
                  </div>
                  <div className="divide-y divide-[#F0D3D9]/50">
                    {matchingProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={() => {
                          openProduct(p.id);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2.5 p-1.5 hover:bg-[#FBE8EC] rounded-lg text-left transition-colors cursor-pointer"
                      >
                        <div className="relative w-9 h-11 rounded overflow-hidden shrink-0 border border-[#F0D3D9]">
                          <Image
                            src={p.images[0] || '/images/dress_floral_maxi.jpg'}
                            alt={p.name}
                            fill
                            sizes="36px"
                            className="object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#2E0C1B] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#8A6B74]">{p.category}</p>
                        </div>
                        <span className="text-xs font-bold text-[#7B1E45] tabular-nums shrink-0">
                          {formatPrice(p.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account with dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                  } else {
                    setUserDropdownOpen(!userDropdownOpen);
                  }
                }}
                aria-label="Account options"
                className="p-2 text-[#2E0C1B] hover:text-[#7B1E45] rounded-full hover:bg-[#FBE8EC] transition-colors cursor-pointer"
              >
                {user ? (
                  <div className="w-6 h-6 rounded-full bg-[#7B1E45] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {userDropdownOpen && user && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#FFF6F7] border border-[#F0D3D9] rounded-xl shadow-aurelle-lg py-2 z-50 text-xs"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#F0D3D9] font-medium text-[#2E0C1B]">
                    <p className="font-bold text-sm text-[#7B1E45]">{user.name}</p>
                    <p className="text-[11px] text-[#8A6B74] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleNavClick('account')}
                    className="w-full text-left px-3.5 py-2 text-[#2E0C1B] hover:bg-[#FBE8EC] hover:text-[#7B1E45] font-medium"
                  >
                    My Orders &amp; Profile
                  </button>
                  <button
                    onClick={() => handleNavClick('wishlist')}
                    className="w-full text-left px-3.5 py-2 text-[#2E0C1B] hover:bg-[#FBE8EC] hover:text-[#7B1E45] font-medium"
                  >
                    My Saved Wishlist
                  </button>
                  <div className="border-t border-[#F0D3D9] my-1" />
                  <button
                    onClick={logoutUser}
                    className="w-full text-left px-3.5 py-2 text-rose-700 hover:bg-[#FBE8EC] font-semibold"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Icon with Heart */}
            <button
              onClick={() => handleNavClick('wishlist')}
              aria-label={`Wishlist (${wishlist.length} items)`}
              className="relative p-2 text-[#2E0C1B] hover:text-[#7B1E45] rounded-full hover:bg-[#FBE8EC] transition-colors cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#D98A90] text-[#7B1E45]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7B1E45] text-white text-[10px] font-semibold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon with small burgundy count badge */}
            <button
              onClick={() => {
                setCurrentView('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label={`Shopping Bag (${cartCount} items)`}
              className="relative p-2 text-[#2E0C1B] hover:text-[#7B1E45] rounded-full hover:bg-[#FBE8EC] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7B1E45] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 sm:hidden border-t border-[#F0D3D9] pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A6B74] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for outfits..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white text-[#2E0C1B] rounded-full border border-[#F0D3D9] focus:outline-none focus:ring-1 focus:ring-[#7B1E45]"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#F0D3D9] bg-[#FFF6F7] px-4 py-4 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentView === 'home' ? 'bg-[#FBE8EC] text-[#7B1E45]' : 'text-[#2E0C1B]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentView === 'shop' ? 'bg-[#FBE8EC] text-[#7B1E45]' : 'text-[#2E0C1B]'
              }`}
            >
              Shop All Dresses & Kurtis
            </button>
            <button
              onClick={() => handleNavClick('account')}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentView === 'account' ? 'bg-[#FBE8EC] text-[#7B1E45]' : 'text-[#2E0C1B]'
              }`}
            >
              My Account &amp; Orders
            </button>
            <div className="pt-2 border-t border-[#F0D3D9] flex justify-between items-center text-xs text-[#8A6B74]">
              <span>Customer Care: +91 98765 43210</span>
              <span className="text-[#2E7D4F] font-semibold">100% Authentic</span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
