'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { formatPrice } from '@/lib/cart-utils';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    cart,
    shippingAddress,
    setShippingAddress,
    cartSubtotal,
    cartShipping,
    cartDiscount,
    cartTotal,
    placeOrder,
    placedOrder,
    checkoutStep,
    setCheckoutStep,
    setCurrentView,
    setTrackingOrder,
  } = useShop();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cards' | 'Cash on Delivery'>('UPI');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const handlePlaceOrder = async () => {
    const order = await placeOrder(paymentMethod);
    setTrackingOrder(order);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.name || !newAddressForm.street || !newAddressForm.pincode) return;
    setShippingAddress({
      id: `addr-${Date.now()}`,
      name: newAddressForm.name,
      street: newAddressForm.street,
      city: newAddressForm.city || 'New Delhi',
      state: newAddressForm.state || 'Delhi',
      pincode: newAddressForm.pincode,
      phone: newAddressForm.phone || '+91 98765 43210',
      isDefault: true,
    });
    setIsAddingNewAddress(false);
  };

  // If order is placed (Step 3: Confirm)
  if (checkoutStep === 3 && placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 sm:p-10 shadow-aurelle text-center">
          <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#2E7D4F] mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2E0C1B] mb-2">
            Thank you, {placedOrder.address.name}!
          </h1>
          <p className="text-sm text-[#8A6B74] mb-6">
            Your order <span className="font-bold text-[#7B1E45]">#{placedOrder.orderNumber}</span> has been placed successfully and will be delivered by {placedOrder.estimatedDelivery}.
          </p>

          {/* Mini receipt */}
          <div className="bg-white rounded-xl border border-[#F0D3D9] p-4 max-w-md mx-auto text-left text-xs mb-6 space-y-2">
            <div className="flex justify-between text-[#8A6B74]">
              <span>Payment Mode:</span>
              <span className="font-semibold text-[#2E0C1B]">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-[#8A6B74]">
              <span>Delivery Address:</span>
              <span className="font-semibold text-[#2E0C1B] truncate max-w-[200px]">
                {placedOrder.address.street}, {placedOrder.address.city}
              </span>
            </div>
            <div className="flex justify-between text-[#8A6B74]">
              <span>Total Paid:</span>
              <span className="font-bold text-[#7B1E45] text-sm tabular-nums">
                {formatPrice(placedOrder.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#7B1E45] hover:bg-[#4A1229] text-white px-6 py-3 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>View in My Orders</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-[#7B1E45] border border-[#D98A90] hover:border-[#7B1E45] px-6 py-3 rounded-[6px] text-xs font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* H1 Checkout */}
      <h1 className="font-playfair text-[#2E0C1B] text-3xl font-bold mb-6 text-center sm:text-left">
        Checkout
      </h1>

      {/* Stepper with 3 steps: (1) Address, (2) Payment, (3) Confirm */}
      <div className="max-w-md mx-auto sm:mx-0 mb-8">
        <div className="flex items-center justify-between relative">
          {/* Connector lines */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-[#F0D3D9] z-0" />

          {/* Step 1: Address */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep >= 1
                  ? 'bg-[#7B1E45] text-white shadow-xs'
                  : 'bg-white border-2 border-[#D98A90] text-[#7B1E45]'
              }`}
            >
              {checkoutStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-[11px] font-semibold text-[#7B1E45] mt-1.5">Address</span>
          </div>

          {/* Step 2: Payment */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep >= 2
                  ? 'bg-[#7B1E45] text-white shadow-xs'
                  : 'bg-white border-2 border-[#D98A90] text-[#8A6B74]'
              }`}
            >
              2
            </div>
            <span className={`text-[11px] font-semibold mt-1.5 ${checkoutStep >= 2 ? 'text-[#7B1E45]' : 'text-[#8A6B74]'}`}>
              Payment
            </span>
          </div>

          {/* Step 3: Confirm */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                checkoutStep === 3
                  ? 'bg-[#7B1E45] text-white shadow-xs'
                  : 'bg-white border-2 border-[#D98A90] text-[#8A6B74]'
              }`}
            >
              3
            </div>
            <span className={`text-[11px] font-semibold mt-1.5 ${checkoutStep === 3 ? 'text-[#7B1E45]' : 'text-[#8A6B74]'}`}>
              Confirm
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden mb-6 bg-[#FFF6F7] border border-[#F0D3D9] rounded-xl p-4">
        <button
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-[#2E0C1B]"
        >
          <span>Order Summary ({cart.length} items)</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#7B1E45] tabular-nums">
              {formatPrice(cartTotal)}
            </span>
            {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {mobileSummaryOpen && (
          <div className="mt-4 pt-4 border-t border-[#F0D3D9] space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-12 rounded overflow-hidden border border-[#F0D3D9]">
                    <Image src={item.product.images[0] || '/images/dress_floral_maxi.jpg'} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E0C1B]">{item.product.name}</p>
                    <p className="text-[10px] text-[#8A6B74]">
                      {item.color} | {item.size} x {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#7B1E45]">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Left Address & Payment, Right Sticky Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold text-[#2E0C1B]">
                Shipping Address
              </h2>
              <button
                onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                className="text-xs font-semibold text-[#7B1E45] hover:underline cursor-pointer"
              >
                + Add New Address
              </button>
            </div>

            {/* Selected Address Card with burgundy border and radio button */}
            <div className="border-2 border-[#7B1E45] bg-white rounded-xl p-4 flex items-start gap-3 shadow-2xs">
              <input
                type="radio"
                name="selected-address"
                checked
                readOnly
                className="w-4 h-4 mt-0.5 text-[#7B1E45] accent-[#7B1E45]"
              />
              <div className="flex-1 text-xs text-[#2E0C1B]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#2E0C1B]">{shippingAddress.name}</span>
                  <span className="bg-[#FBE8EC] text-[#7B1E45] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    DEFAULT
                  </span>
                </div>
                <p className="text-[#8A6B74] leading-relaxed">
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
                <p className="text-[#8A6B74] mt-1">Phone: {shippingAddress.phone}</p>
              </div>
            </div>

            {/* Expandable Form to Add New Address */}
            {isAddingNewAddress && (
              <form onSubmit={handleSaveNewAddress} className="mt-4 pt-4 border-t border-[#F0D3D9] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    className="p-2 border border-[#F0D3D9] rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="p-2 border border-[#F0D3D9] rounded-lg bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address (House No, Building, Street)"
                  required
                  value={newAddressForm.street}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, street: e.target.value })}
                  className="w-full p-2 border border-[#F0D3D9] rounded-lg bg-white"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    className="p-2 border border-[#F0D3D9] rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    className="p-2 border border-[#F0D3D9] rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    required
                    value={newAddressForm.pincode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                    className="p-2 border border-[#F0D3D9] rounded-lg bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="bg-[#7B1E45] text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Save & Use Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="border border-[#F0D3D9] px-4 py-2 rounded-lg text-[#8A6B74]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
            <h2 className="font-playfair text-xl font-bold text-[#2E0C1B] mb-4">
              Payment Method
            </h2>

            {/* Bordered list of radio rows: UPI, Cards, Cash on Delivery */}
            <div className="border border-[#F0D3D9] rounded-xl overflow-hidden bg-white divide-y divide-[#F0D3D9]">
              {/* Row 1: UPI (Google Pay, PhonePe) */}
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FFF6F7] transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="w-4 h-4 text-[#7B1E45] accent-[#7B1E45]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#2E0C1B]">UPI (Google Pay, PhonePe, Paytm)</p>
                    <p className="text-[11px] text-[#8A6B74]">Instant zero-fee transfer via any UPI app</p>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-[#7B1E45]" />
              </label>

              {/* Row 2: Cards (Visa, Mastercard) */}
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FFF6F7] transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="Cards"
                    checked={paymentMethod === 'Cards'}
                    onChange={() => setPaymentMethod('Cards')}
                    className="w-4 h-4 text-[#7B1E45] accent-[#7B1E45]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#2E0C1B]">Credit / Debit Cards (Visa, Mastercard, RuPay)</p>
                    <p className="text-[11px] text-[#8A6B74]">Encrypted 256-bit bank grade security</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-[#7B1E45]" />
              </label>

              {/* Row 3: Cash on Delivery */}
              <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FFF6F7] transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment-method"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-[#7B1E45] accent-[#7B1E45]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#2E0C1B]">Cash on Delivery</p>
                    <p className="text-[11px] text-[#8A6B74]">Pay cash or UPI to delivery executive at doorstep</p>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-[#7B1E45]" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary Card */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-[#FFF6F7] border border-[#F0D3D9] rounded-2xl p-6 shadow-aurelle">
            <h2 className="font-playfair text-xl font-bold text-[#2E0C1B] mb-4 pb-3 border-b border-[#F0D3D9]">
              Order Summary
            </h2>

            {/* Items list */}
            <div className="space-y-3.5 mb-6 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-[#F0D3D9] shrink-0 bg-white">
                      <Image
                        src={item.product.images[0] || '/images/dress_floral_maxi.jpg'}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2E0C1B] truncate max-w-[160px]">
                        {item.product.name}
                      </p>
                      <p className="text-[#8A6B74] text-[11px]">
                        {item.color} | {item.size}
                      </p>
                      <p className="text-[11px] text-[#8A6B74]">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <span className="font-bold text-[#7B1E45] tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-[#F0D3D9] text-xs">
              <div className="flex justify-between text-[#8A6B74]">
                <span>Subtotal</span>
                <span className="text-[#2E0C1B] font-semibold tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#7B1E45]">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#8A6B74]">
                <span>Shipping</span>
                <span className="text-[#2E7D4F] font-bold">
                  {cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}
                </span>
              </div>

              <div className="border-t border-[#F0D3D9] pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#2E0C1B]">Total</span>
                <span className="text-2xl font-bold text-[#7B1E45] tabular-nums">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Full-width burgundy "Place Order →" button */}
            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="w-full mt-6 bg-[#7B1E45] hover:bg-[#4A1229] disabled:opacity-50 text-white py-3.5 px-4 rounded-[6px] text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8A6B74]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
              <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
