'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Heart,
} from 'lucide-react';

export default function Footer() {
  const { setCurrentView, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to the Aurelle Circle! Check your inbox for exclusive perks.', 'success');
  };

  return (
    <footer className="relative bg-[#FFF6F7] border-t border-[#F0D3D9] mt-16 overflow-hidden">
      {/* Decorative Pink Blossom Illustration (Bottom-Right Corner) */}
      <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-40 z-0 w-64 h-64 sm:w-80 sm:h-80">
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M50 300C70 230 110 170 170 130C220 95 260 70 300 50"
            stroke="#D98A90"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M170 130C150 100 120 90 90 90"
            stroke="#D98A90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M130 180C100 170 80 180 60 200"
            stroke="#D98A90"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Blossoms */}
          <circle cx="170" cy="130" r="14" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1.5" />
          <circle cx="170" cy="130" r="6" fill="#7B1E45" />
          <circle cx="90" cy="90" r="12" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1.2" />
          <circle cx="90" cy="90" r="5" fill="#D98A90" />
          <circle cx="60" cy="200" r="10" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
          <circle cx="60" cy="200" r="4" fill="#7B1E45" />
          <circle cx="230" cy="85" r="11" fill="#FFF6F7" stroke="#7B1E45" strokeWidth="1" />
          <circle cx="230" cy="85" r="4.5" fill="#D98A90" />
          {/* Falling Petals */}
          <ellipse cx="120" cy="140" rx="6" ry="10" transform="rotate(-30 120 140)" fill="#D98A90" fillOpacity="0.4" />
          <ellipse cx="200" cy="70" rx="5" ry="9" transform="rotate(40 200 70)" fill="#D98A90" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Top Strip with 4 sections separated by thin vertical dividers */}
      <div className="border-b border-[#F0D3D9] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#F0D3D9]">
            {/* 1. Logo + Tagline */}
            <div className="flex items-center gap-3 pb-4 sm:pb-0">
              <div className="w-10 h-10 rounded-full bg-[#7B1E45] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-xs">
                A
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#2E0C1B] block">
                  AURELLE
                </span>
                <span className="text-[11px] text-[#8A6B74]">
                  Wear your mood. Own your style.
                </span>
              </div>
            </div>

            {/* 2. Free Shipping */}
            <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-full bg-[#FBE8EC] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#7B1E45]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2E0C1B]">Free Shipping</p>
                <p className="text-[11px] text-[#8A6B74]">Above ₹999 across India</p>
              </div>
            </div>

            {/* 3. Easy Returns */}
            <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-full bg-[#FBE8EC] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#7B1E45]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2E0C1B]">Easy Returns</p>
                <p className="text-[11px] text-[#8A6B74]">Within 7 Days doorstep pickup</p>
              </div>
            </div>

            {/* 4. Secure Payments */}
            <div className="flex items-center gap-3.5 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-10 h-10 rounded-full bg-[#FBE8EC] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#7B1E45]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2E0C1B]">Secure Payments</p>
                <p className="text-[11px] text-[#8A6B74]">100% Secure & encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Newsletter + Links + Follow Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Newsletter Box */}
          <div className="md:col-span-5 lg:col-span-5">
            <h3 className="font-playfair text-xl font-bold text-[#2E0C1B] mb-1">
              Subscribe to our Newsletter
            </h3>
            <p className="text-xs text-[#8A6B74] mb-4">
              Get the latest trends &amp; offers! Be the first to know about private sales.
            </p>

            {subscribed ? (
              <div className="bg-[#EBF7EE] text-[#2E7D4F] p-3 rounded-lg text-xs font-semibold">
                ✓ You&apos;re subscribed with {email}!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-r-0 border-[#F0D3D9] rounded-l-[6px] px-3.5 py-2.5 text-xs text-[#2E0C1B] placeholder-[#8A6B74] focus:outline-none focus:ring-1 focus:ring-[#7B1E45]"
                />
                <button
                  type="submit"
                  className="bg-[#7B1E45] hover:bg-[#4A1229] text-white px-5 py-2.5 rounded-r-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Follow Us with Instagram, Facebook, YouTube, Pinterest icons (plum #2E0C1B) */}
            <div className="mt-6">
              <span className="text-xs font-semibold text-[#2E0C1B] block mb-2.5 uppercase tracking-wider">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white border border-[#F0D3D9] flex items-center justify-center text-[#2E0C1B] hover:text-[#7B1E45] hover:border-[#7B1E45] shadow-2xs transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white border border-[#F0D3D9] flex items-center justify-center text-[#2E0C1B] hover:text-[#7B1E45] hover:border-[#7B1E45] shadow-2xs transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#youtube"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white border border-[#F0D3D9] flex items-center justify-center text-[#2E0C1B] hover:text-[#7B1E45] hover:border-[#7B1E45] shadow-2xs transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                {/* Pinterest SVG icon */}
                <a
                  href="#pinterest"
                  aria-label="Pinterest"
                  className="w-8 h-8 rounded-full bg-white border border-[#F0D3D9] flex items-center justify-center text-[#2E0C1B] hover:text-[#7B1E45] hover:border-[#7B1E45] shadow-2xs transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.257-.402.156-1.5-.694-2.437-2.873-2.437-4.625 0-3.766 2.736-7.227 7.892-7.227 4.143 0 7.362 2.952 7.362 6.899 0 4.117-2.596 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.374l-.746 2.842c-.27 1.034-1.002 2.331-1.492 3.123C10.045 23.858 11.009 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-7 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-[#2E0C1B] mb-3 uppercase tracking-wider">
                Shop By
              </h4>
              <ul className="space-y-2 text-[#8A6B74]">
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-[#7B1E45]">
                    Maxi Dresses
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-[#7B1E45]">
                    Midi Dresses
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-[#7B1E45]">
                    Embroidered Kurtis
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-[#7B1E45]">
                    Festive Anarkalis
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('shop')} className="hover:text-[#7B1E45]">
                    Co-ord Sets
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#2E0C1B] mb-3 uppercase tracking-wider">
                Customer Care
              </h4>
              <ul className="space-y-2 text-[#8A6B74]">
                <li>
                  <button onClick={() => setCurrentView('account')} className="hover:text-[#7B1E45]">
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('account')} className="hover:text-[#7B1E45]">
                    Shipping &amp; Returns
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('account')} className="hover:text-[#7B1E45]">
                    Size Chart &amp; Fit Guide
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#7B1E45]">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#7B1E45]">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#2E0C1B] mb-3 uppercase tracking-wider">
                About Aurelle
              </h4>
              <ul className="space-y-2 text-[#8A6B74]">
                <li>
                  <button onClick={() => setCurrentView('home')} className="hover:text-[#7B1E45]">
                    Our Story
                  </button>
                </li>
                <li>
                  <a href="#artisans" className="hover:text-[#7B1E45]">
                    Artisan Craftsmanship
                  </a>
                </li>
                <li>
                  <a href="#sustainability" className="hover:text-[#7B1E45]">
                    Sustainable Fabrics
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-[#7B1E45]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 mt-8 border-t border-[#F0D3D9] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A6B74] gap-2">
          <p>© 2025 AURELLE Apparels Private Limited. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-[#7B1E45] fill-current" /> in Jaipur &amp; New Delhi
          </p>
        </div>
      </div>
    </footer>
  );
}
