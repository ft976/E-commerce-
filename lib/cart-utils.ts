import { CartItem } from './types';

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 149;

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function applyCoupon(subtotal: number, code: string): { valid: boolean; discount: number; message: string } {
  const normalized = code.trim().toUpperCase();
  if (normalized === 'AURELLE10') {
    const discount = Math.round(subtotal * 0.1);
    return {
      valid: true,
      discount,
      message: '10% discount applied successfully!',
    };
  }
  if (normalized === 'FESTIVE20' && subtotal >= 2000) {
    const discount = Math.round(subtotal * 0.2);
    return {
      valid: true,
      discount,
      message: '20% festive discount applied!',
    };
  }
  return {
    valid: false,
    discount: 0,
    message: 'Invalid or expired coupon code',
  };
}

export function calculateOrderTotal(subtotal: number, shipping: number, discount: number = 0): number {
  const total = subtotal + shipping - discount;
  return Math.max(0, total);
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
