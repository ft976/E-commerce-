'use client';

import React, { useState, useMemo } from 'react';
import { useShop } from '@/context/ShopContext';
import { filterProducts, sortProducts } from '@/lib/filter-utils';
import ProductCard from './ProductCard';
import { ChevronRight, SlidersHorizontal, X, Check, Sparkles } from 'lucide-react';
import { ProductSize, FilterState } from '@/lib/types';

const CATEGORY_FILTERS = [
  'Maxi Dresses',
  'Midi Dresses',
  'Short Dresses',
  'Party Dresses',
];

const SIZE_CHIPS: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLOR_SWATCHES_ROW1 = [
  { name: 'Dusty Rose', hex: '#D98A90' },
  { name: 'Red', hex: '#C0392B' },
  { name: 'Amber', hex: '#D35400' },
  { name: 'Teal', hex: '#16A085' },
  { name: 'Olive', hex: '#6B8E23' },
];

const COLOR_SWATCHES_ROW2 = [
  { name: 'Pink', hex: '#F48FB1' },
  { name: 'Purple', hex: '#8E24AA' },
  { name: 'Blue', hex: '#2980B9' },
  { name: 'Orange', hex: '#E67E22' },
];

const PRICE_RANGES = ['₹499 - ₹999', '₹1,000 - ₹1,999', '₹2,000+'];

export default function ProductListingPage() {
  const { setCurrentView, filters, setFilters, searchQuery, setSearchQuery, products } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  // Toggle Category Checkbox
  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists ? prev.categories.filter((c) => c !== category) : [...prev.categories, category],
      };
    });
    setCurrentPage(1);
  };

  // Toggle Size Chip
  const handleSizeToggle = (size: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
    setCurrentPage(1);
  };

  // Toggle Color Swatch
  const handleColorToggle = (colorName: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName],
      };
    });
    setCurrentPage(1);
  };

  // Toggle Price Range
  const handlePriceRangeToggle = (range: string) => {
    setFilters((prev) => {
      const exists = prev.priceRanges.includes(range);
      return {
        ...prev,
        priceRanges: exists ? prev.priceRanges.filter((r) => r !== range) : [...prev.priceRanges, range],
      };
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRanges: [],
      sortBy: 'popularity',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    // When on Dresses listing, restrict to Dresses by default if no category filter is chosen
    const baseProducts =
      filters.categories.length > 0
        ? products
        : products.filter((p) => p.category === 'Dresses');

    const matched = filterProducts(baseProducts, filters, searchQuery);
    return sortProducts(matched, filters.sortBy);
  }, [filters, searchQuery, products]);

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const activeFiltersCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    filters.priceRanges.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb: Home > Dresses */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8A6B74] mb-4">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#7B1E45] transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-[#D98A90]" />
        <span className="font-semibold text-[#7B1E45]">Dresses</span>
      </nav>

      {/* Header bar: H1 + Subtitle + Sort Dropdown */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#F0D3D9]">
        <div>
          <h1 className="font-playfair text-[#2E0C1B] text-3xl sm:text-4xl font-bold mb-1">
            Dresses
          </h1>
          <p className="text-sm text-[#8A6B74]">
            Discover our stunning collection of dresses
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
          {/* Mobile filter toggle button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#7B1E45] bg-[#FFF6F7] border border-[#F0D3D9] rounded-lg shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-dropdown" className="text-xs text-[#8A6B74] whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-dropdown"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as FilterState['sortBy'],
                }))
              }
              className="bg-[#FFF6F7] border border-[#F0D3D9] text-[#2E0C1B] text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7B1E45] shadow-xs cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Sidebar (240px) + Right Products Grid (3 cols x 2 rows) */}
      <div className="flex gap-8 pt-6">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden md:block w-60 shrink-0 border-r border-[#F0D3D9] pr-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#2E0C1B]">
              Filter By
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#7B1E45] hover:underline font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Checkboxes */}
          <div className="mb-6 pb-6 border-b border-[#F0D3D9]">
            <h3 className="text-xs font-semibold text-[#2E0C1B] mb-3 uppercase tracking-wide">
              Category
            </h3>
            <div className="space-y-2.5">
              {CATEGORY_FILTERS.map((cat) => {
                const checked = filters.categories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex items-center gap-2.5 text-xs text-[#2E0C1B] cursor-pointer hover:text-[#7B1E45] group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 rounded text-[#7B1E45] accent-[#7B1E45] border-[#D98A90] focus:ring-[#7B1E45] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-[#7B1E45]' : ''}>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Size Chips (Outlined Squares) */}
          <div className="mb-6 pb-6 border-b border-[#F0D3D9]">
            <h3 className="text-xs font-semibold text-[#2E0C1B] mb-3 uppercase tracking-wide">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_CHIPS.map((size) => {
                const isSelected = filters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-9 h-9 rounded-[6px] border text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#7B1E45] bg-[#7B1E45] text-white ring-2 ring-[#7B1E45] ring-offset-1'
                        : 'border-[#F0D3D9] bg-white text-[#2E0C1B] hover:border-[#7B1E45] hover:text-[#7B1E45]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour (2 rows of circular swatches) */}
          <div className="mb-6 pb-6 border-b border-[#F0D3D9]">
            <h3 className="text-xs font-semibold text-[#2E0C1B] mb-3 uppercase tracking-wide">
              Colour
            </h3>
            <div className="space-y-2.5">
              {/* Row 1: dusty rose, red, amber, teal, olive */}
              <div className="flex items-center gap-2">
                {COLOR_SWATCHES_ROW1.map((c) => {
                  const isSelected = filters.colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorToggle(c.name)}
                      title={c.name}
                      aria-label={`Filter by ${c.name}`}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border border-black/10 transition-transform hover:scale-110 flex items-center justify-center ${
                        isSelected ? 'ring-2 ring-[#7B1E45] ring-offset-2 scale-110' : ''
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>

              {/* Row 2: pink, purple, blue, orange */}
              <div className="flex items-center gap-2">
                {COLOR_SWATCHES_ROW2.map((c) => {
                  const isSelected = filters.colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorToggle(c.name)}
                      title={c.name}
                      aria-label={`Filter by ${c.name}`}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border border-black/10 transition-transform hover:scale-110 flex items-center justify-center ${
                        isSelected ? 'ring-2 ring-[#7B1E45] ring-offset-2 scale-110' : ''
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Price Range Checkboxes */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#2E0C1B] mb-3 uppercase tracking-wide">
              Price Range
            </h3>
            <div className="space-y-2.5">
              {PRICE_RANGES.map((range) => {
                const checked = filters.priceRanges.includes(range);
                return (
                  <label
                    key={range}
                    className="flex items-center gap-2.5 text-xs text-[#2E0C1B] cursor-pointer hover:text-[#7B1E45] group"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePriceRangeToggle(range)}
                      className="w-4 h-4 rounded text-[#7B1E45] accent-[#7B1E45] border-[#D98A90] focus:ring-[#7B1E45] cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-[#7B1E45]' : ''}>{range}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Section: Product Grid (3 columns x 2 rows on desktop) */}
        <div className="flex-1">
          {searchQuery && (
            <div className="mb-4 text-xs text-[#8A6B74] flex items-center gap-2">
              <span>Showing search results for &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => setSearchQuery('')} className="text-[#7B1E45] font-semibold underline">
                Clear search
              </button>
            </div>
          )}

          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFF6F7] rounded-2xl border border-[#F0D3D9] p-8">
              <p className="text-base font-semibold text-[#2E0C1B] mb-2">No outfits match your filters</p>
              <p className="text-xs text-[#8A6B74] mb-4">Try clearing active category or price range selections.</p>
              <button
                onClick={handleResetFilters}
                className="bg-[#7B1E45] text-white px-5 py-2 text-xs font-semibold rounded-[6px] hover:bg-[#4A1229]"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Centered Pagination: ‹ 1 2 3 › */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="w-8 h-8 rounded-[6px] border border-[#F0D3D9] bg-white text-[#2E0C1B] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#7B1E45] flex items-center justify-center text-sm font-semibold transition-colors"
            >
              ‹
            </button>

            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-[6px] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#7B1E45] text-white shadow-xs'
                    : 'border border-[#F0D3D9] bg-white text-[#2E0C1B] hover:border-[#7B1E45]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="w-8 h-8 rounded-[6px] border border-[#F0D3D9] bg-white text-[#2E0C1B] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#7B1E45] flex items-center justify-center text-sm font-semibold transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative bg-[#FFF6F7] rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl z-10 border-t border-[#F0D3D9]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0D3D9] mb-4">
              <h2 className="text-base font-bold text-[#2E0C1B]">Filter Products</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-[#8A6B74] hover:text-[#2E0C1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Checkboxes */}
            <div className="mb-5 pb-5 border-b border-[#F0D3D9]">
              <h3 className="text-xs font-semibold text-[#2E0C1B] mb-2 uppercase">Category</h3>
              <div className="space-y-2">
                {CATEGORY_FILTERS.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-xs text-[#2E0C1B]">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="rounded text-[#7B1E45] accent-[#7B1E45]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Chips */}
            <div className="mb-5 pb-5 border-b border-[#F0D3D9]">
              <h3 className="text-xs font-semibold text-[#2E0C1B] mb-2 uppercase">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZE_CHIPS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-9 h-9 rounded-[6px] border text-xs font-semibold flex items-center justify-center ${
                      filters.sizes.includes(size)
                        ? 'border-[#7B1E45] bg-[#7B1E45] text-white'
                        : 'border-[#F0D3D9] bg-white text-[#2E0C1B]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[#2E0C1B] mb-2 uppercase">Price</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label key={range} className="flex items-center gap-2 text-xs text-[#2E0C1B]">
                    <input
                      type="checkbox"
                      checked={filters.priceRanges.includes(range)}
                      onChange={() => handlePriceRangeToggle(range)}
                      className="rounded text-[#7B1E45] accent-[#7B1E45]"
                    />
                    <span>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 text-xs font-semibold text-[#7B1E45] border border-[#7B1E45] rounded-[6px]"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-semibold bg-[#7B1E45] text-white rounded-[6px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
