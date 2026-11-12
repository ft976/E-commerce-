'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, Flame, ShieldCheck } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, pendingActionNotice, showToast } = useShop();
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Authenticate exclusively using Firebase Auth servers
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      showToast('Successfully signed in with Google!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      showToast(msg, 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-[#8A6B74] hover:text-[#2E0C1B] rounded-full hover:bg-[#FBE8EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-14 h-14 rounded-full bg-[#7B1E45] text-white mx-auto flex items-center justify-center font-serif text-2xl font-bold shadow-md mb-3">
            A
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2E0C1B]">
            Welcome to AURELLE
          </h2>
          <p className="text-xs sm:text-sm text-[#8A6B74] mt-1.5 max-w-xs mx-auto">
            {pendingActionNotice || 'Sign in with your Google account to manage your shopping bag, wishlist, and orders.'}
          </p>

          {/* Firebase Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-[#E8F5E9] text-[#2E7D4F] text-[11px] font-bold border border-[#C8E6C9]">
            <Flame className="w-3.5 h-3.5 text-[#E65100]" />
            <span>Powered by Firebase Auth & Firestore</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-4 py-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-[#2E0C1B] border-2 border-[#F0D3D9] hover:border-[#7B1E45] py-3.5 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.15v3.15C3.19 21.31 7.27 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.15C.42 8.1 0 9.99 0 12s.42 3.9 1.15 5.4l4.12-3.16z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.19 2.69 1.15 6.6l4.12 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-[#F0D3D9] flex items-center justify-center gap-2 text-[11px] text-[#8A6B74]">
          <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
          <span>Secure Authentication & Activity Storage via Firebase</span>
        </div>
      </div>
    </div>
  );
}
