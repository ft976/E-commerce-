import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateShipping,
  applyCoupon,
  calculateOrderTotal,
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
} from './cart-utils';
import { CartItem, Product } from './types';

const mockProduct: Product = {
  id: 'p1',
  name: 'Floral Maxi Dress',
  category: 'Dresses',
  price: 1999,
  originalPrice: 2499,
  rating: 4.6,
  reviewCount: 120,
  description: 'Flowy dress',
  images: [],
  colors: [{ name: 'Pink', hex: '#fff' }],
  sizes: ['M'],
};

const mockProduct2: Product = {
  id: 'p2',
  name: 'Embroidered Kurti',
  category: 'Kurtis',
  price: 1799,
  originalPrice: 2299,
  rating: 4.8,
  reviewCount: 90,
  description: 'Kurti',
  images: [],
  colors: [{ name: 'Maroon', hex: '#000' }],
  sizes: ['M'],
};

test('calculateSubtotal sums line items correctly', () => {
  const items: CartItem[] = [
    { id: '1', productId: 'p1', product: mockProduct, size: 'M', color: 'Pink', quantity: 1 },
    { id: '2', productId: 'p2', product: mockProduct2, size: 'M', color: 'Maroon', quantity: 1 },
  ];
  assert.equal(calculateSubtotal(items), 3798);
});

test('calculateShipping provides free shipping above threshold ₹999', () => {
  assert.equal(calculateShipping(3798), 0);
  assert.equal(calculateShipping(FREE_SHIPPING_THRESHOLD), 0);
  assert.equal(calculateShipping(500), 149);
  assert.equal(calculateShipping(0), 0);
});

test('applyCoupon works for AURELLE10 code', () => {
  const result = applyCoupon(3798, 'AURELLE10');
  assert.equal(result.valid, true);
  assert.equal(result.discount, 380);

  const invalid = applyCoupon(3798, 'FAKECODE');
  assert.equal(invalid.valid, false);
  assert.equal(invalid.discount, 0);
});

test('calculateOrderTotal computes final price correctly', () => {
  assert.equal(calculateOrderTotal(3798, 0, 0), 3798);
  assert.equal(calculateOrderTotal(800, 149, 0), 949);
});

test('formatPrice formats Indian Rupee correctly', () => {
  assert.equal(formatPrice(1999), '₹1,999');
  assert.equal(formatPrice(3798), '₹3,798');
});
