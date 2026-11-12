'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/cart-utils';
import {
  Package,
  User as UserIcon,
  MapPin,
  Heart,
  Star,
  RotateCcw,
  Settings,
  LogOut,
  ChevronDown,
  ArrowRight,
  Truck,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function AccountPage() {
  const { orders, setCurrentView, wishlist, openProduct } = useShop();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'profile' | 'addresses' | 'wishlist' | 'reviews' | 'returns' | 'settings'
  >('orders');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const sidebarItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header: H1 "My Account" + Right-aligned user chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0D3D9] mb-8 gap-4">
        <h1 className="font-playfair text-[#2E0C1B] text-3xl font-bold">
          My Account
        </h1>

        {/* User Chip: round avatar + "Account" with dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 bg-white border border-[#F0D3D9] rounded-full py-1.5 px-3 shadow-xs hover:border-[#7B1E45] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#7B1E45] text-white flex items-center justify-center text-xs font-bold">
              U
            </div>
            <span className="text-xs font-semibold text-[#2E0C1B]">My Profile</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A6B74]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFF6F7] border border-[#F0D3D9] rounded-xl shadow-aurelle-lg py-2 z-30 text-xs">
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#FBE8EC] text-[#2E0C1B]"
              >
                Track Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#FBE8EC] text-[#2E0C1B]"
              >
                Edit Profile
              </button>
              <div className="border-t border-[#F0D3D9] my-1" />
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  setCurrentView('home');
                }}
                className="w-full text-left px-4 py-2 text-rose-700 hover:bg-[#FBE8EC] flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Body: Left Sidebar Menu + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <aside className="md:col-span-4 lg:col-span-3 bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-3 shadow-aurelle">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FBE8EC] text-[#7B1E45] shadow-xs'
                      : 'text-[#2E0C1B] hover:bg-white hover:text-[#7B1E45]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7B1E45]' : 'text-[#8A6B74]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#F0D3D9]">
              <button
                onClick={() => setCurrentView('home')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8A6B74] hover:text-[#7B1E45] hover:bg-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="md:col-span-8 lg:col-span-9">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-[#2E0C1B]">
                  My Orders ({orders.length})
                </h2>
                <span className="text-xs text-[#8A6B74]">Showing all past purchases</span>
              </div>

              {/* Stacked White Rounded Cards */}
              {orders.map((order) => {
                const primaryItem = order.items[0];
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#F0D3D9] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-aurelle hover:shadow-aurelle-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* 72px product thumbnail */}
                      <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 border border-[#F0D3D9] bg-[#FFF6F7]">
                        <Image
                          src={primaryItem?.product.images[0] || '/images/hero_maroon_kurta.jpg'}
                          alt={primaryItem?.product.name || 'Order product'}
                          fill
                          sizes="72px"
                          className="object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[#2E0C1B]">
                            Order #{order.orderNumber}
                          </span>
                          {/* Green Delivered Badge */}
                          <span className="bg-[#EBF7EE] text-[#2E7D4F] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4F]" />
                            {order.status}
                          </span>
                        </div>

                        <p className="text-xs text-[#2E0C1B] font-medium">
                          {primaryItem?.product.name}
                          {order.items.length > 1 && (
                            <span className="text-[#8A6B74] font-normal"> + {order.items.length - 1} more</span>
                          )}
                        </p>

                        <p className="text-[11px] text-[#8A6B74] mt-0.5">
                          Placed on: <span className="font-medium text-[#2E0C1B]">{order.date}</span>
                        </p>
                      </div>
                    </div>

                    {/* Price on right & Outlined burgundy "Track Order →" button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-[#F0D3D9]">
                      <span className="text-base sm:text-lg font-bold text-[#7B1E45] tabular-nums">
                        {formatPrice(order.total)}
                      </span>

                      <button
                        onClick={() => setSelectedOrderForTracking(order)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B1E45] hover:text-[#4A1229] border border-[#7B1E45] hover:bg-[#FFF6F7] px-3.5 py-1.5 rounded-[6px] transition-all cursor-pointer"
                      >
                        <span>Track Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle space-y-4">
              <h2 className="text-base font-bold text-[#2E0C1B]">Personal Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#8A6B74] block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full p-2.5 border border-[#F0D3D9] rounded-lg bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#8A6B74] block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full p-2.5 border border-[#F0D3D9] rounded-lg bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#8A6B74] block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+91 Mobile Number"
                    className="w-full p-2.5 border border-[#F0D3D9] rounded-lg bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#8A6B74] block mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    className="w-full p-2.5 border border-[#F0D3D9] rounded-lg bg-white font-medium"
                  />
                </div>
              </div>
              <button className="bg-[#7B1E45] text-white px-5 py-2 rounded-lg text-xs font-semibold">
                Save Changes
              </button>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-[#2E0C1B]">Saved Addresses</h2>
                <button className="text-xs font-semibold text-[#7B1E45] underline">+ Add New</button>
              </div>
              <div className="border border-[#7B1E45] rounded-xl p-4 bg-[#FFF6F7] text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">Priya Sharma</span>
                  <span className="text-[10px] bg-[#7B1E45] text-white px-2 py-0.5 rounded font-semibold">
                    DEFAULT
                  </span>
                </div>
                <p className="text-[#8A6B74]">123 Lotus Park, New Delhi, Delhi - 110001</p>
                <p className="text-[#8A6B74] mt-1">Phone: +91 98765 43210</p>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-[#2E0C1B]">Saved Wishlist ({wishlist.length})</h2>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="text-xs font-bold text-[#7B1E45] hover:underline cursor-pointer"
                >
                  View All Liked Clothes →
                </button>
              </div>
              {wishlist.length === 0 ? (
                <p className="text-xs text-[#8A6B74]">No items currently saved to wishlist.</p>
              ) : (
                <p className="text-xs text-[#8A6B74]">
                  You have {wishlist.length} item(s) saved. Tap above to view all liked outfits!
                </p>
              )}
            </div>
          )}

          {/* Other tabs fallback */}
          {['reviews', 'returns', 'settings'].includes(activeTab) && (
            <div className="bg-white border border-[#F0D3D9] rounded-2xl p-8 shadow-aurelle text-center">
              <p className="text-sm font-semibold text-[#2E0C1B] capitalize mb-1">{activeTab}</p>
              <p className="text-xs text-[#8A6B74]">All systems normal. No active disputes or pending actions.</p>
            </div>
          )}
        </main>
      </div>

      {/* Track Order Live Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#8A6B74] hover:text-[#2E0C1B] hover:bg-[#FBE8EC]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-[#7B1E45]" />
              <h3 className="text-base font-bold text-[#2E0C1B]">
                Track Order #{selectedOrderForTracking.orderNumber}
              </h3>
            </div>
            <p className="text-xs text-[#8A6B74] mb-6">
              Status: <span className="font-bold text-[#2E7D4F]">{selectedOrderForTracking.status}</span>
            </p>

            {/* Tracking Milestones */}
            <div className="space-y-4 border-l-2 border-[#7B1E45] ml-4 pl-4 relative text-xs">
              {selectedOrderForTracking.trackingUpdates?.map((update, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#7B1E45] border-2 border-white" />
                  <p className="font-bold text-[#2E0C1B]">{update.status}</p>
                  <p className="text-[#8A6B74] text-[11px]">{update.description}</p>
                  <span className="text-[10px] text-[#8A6B74]/80">{update.time}</span>
                </div>
              )) || (
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#7B1E45] border-2 border-white" />
                  <p className="font-bold text-[#2E0C1B]">Order Dispatched</p>
                  <p className="text-[#8A6B74] text-[11px]">En route to Delhi distribution hub.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full mt-6 bg-[#7B1E45] text-white py-2.5 rounded-[6px] text-xs font-semibold"
            >
              Close Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
