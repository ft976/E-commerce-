import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts, sortProducts, matchesPriceRange } from './filter-utils';
import { Product, FilterState } from './types';

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Floral Maxi Dress',
    category: 'Dresses',
    subcategory: 'Maxi Dresses',
    price: 1999,
    originalPrice: 2499,
    rating: 4.6,
    reviewCount: 12000,
    description: 'Floral georgette',
    images: [],
    colors: [{ name: 'Burgundy', hex: '#7B1E45' }, { name: 'Rose', hex: '#D98A90' }],
    sizes: ['M', 'L'],
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'Solid Midi Dress',
    category: 'Dresses',
    subcategory: 'Midi Dresses',
    price: 1799,
    originalPrice: 2299,
    rating: 4.8,
    reviewCount: 8000,
    description: 'Solid midi',
    images: [],
    colors: [{ name: 'Dusty Rose', hex: '#D98A90' }, { name: 'Teal', hex: '#16A085' }],
    sizes: ['S', 'M'],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Tiered Dress',
    category: 'Dresses',
    subcategory: 'Party Dresses',
    price: 2099,
    originalPrice: 2699,
    rating: 4.9,
    reviewCount: 9000,
    description: 'Tiered ruffle',
    images: [],
    colors: [{ name: 'Pink', hex: '#ff007f' }],
    sizes: ['XS', 'S'],
    isNew: true,
  },
];

const emptyFilter: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  priceRanges: [],
  sortBy: 'popularity',
};

test('matchesPriceRange filters by bracket correctly', () => {
  assert.equal(matchesPriceRange(799, '₹499 - ₹999'), true);
  assert.equal(matchesPriceRange(1299, '₹499 - ₹999'), false);
  assert.equal(matchesPriceRange(1799, '₹1,000 - ₹1,999'), true);
  assert.equal(matchesPriceRange(2099, '₹2,000+'), true);
});

test('filterProducts filters by subcategory', () => {
  const result = filterProducts(sampleProducts, {
    ...emptyFilter,
    categories: ['Maxi Dresses'],
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '1');
});

test('filterProducts filters by size', () => {
  const result = filterProducts(sampleProducts, {
    ...emptyFilter,
    sizes: ['XS'],
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, '3');
});

test('sortProducts sorts price ascending and descending correctly', () => {
  const asc = sortProducts(sampleProducts, 'price-asc');
  assert.equal(asc[0].price, 1799);
  assert.equal(asc[2].price, 2099);

  const desc = sortProducts(sampleProducts, 'price-desc');
  assert.equal(desc[0].price, 2099);
  assert.equal(desc[2].price, 1799);
});
