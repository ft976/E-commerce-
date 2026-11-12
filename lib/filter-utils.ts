import { Product, FilterState } from './types';

export function matchesPriceRange(price: number, range: string): boolean {
  if (range === '₹499 - ₹999') {
    return price >= 499 && price <= 999;
  }
  if (range === '₹1,000 - ₹1,999') {
    return price >= 1000 && price <= 1999;
  }
  if (range === '₹2,000+') {
    return price >= 2000;
  }
  return true;
}

export function filterProducts(products: Product[], filters: FilterState, searchQuery: string = ''): Product[] {
  return products.filter((product) => {
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = product.name.toLowerCase().includes(q);
      const catMatch = product.category.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      if (!nameMatch && !catMatch && !descMatch) return false;
    }

    // Category / Subcategory check
    if (filters.categories && filters.categories.length > 0) {
      const matchesCategory = filters.categories.some((c) => {
        return (
          product.category.toLowerCase() === c.toLowerCase() ||
          (product.subcategory && product.subcategory.toLowerCase() === c.toLowerCase())
        );
      });
      if (!matchesCategory) return false;
    }

    // Size check
    if (filters.sizes && filters.sizes.length > 0) {
      const matchesSize = filters.sizes.some((s) => (product.sizes as string[]).includes(s));
      if (!matchesSize) return false;
    }

    // Color check
    if (filters.colors && filters.colors.length > 0) {
      const matchesColor = filters.colors.some((filterColor) =>
        product.colors.some((pc) =>
          pc.name.toLowerCase().includes(filterColor.toLowerCase()) ||
          filterColor.toLowerCase().includes(pc.name.toLowerCase())
        )
      );
      if (!matchesColor) return false;
    }

    // Price range check
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      const matchesPrice = filters.priceRanges.some((range) => matchesPriceRange(product.price, range));
      if (!matchesPrice) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: FilterState['sortBy']): Product[] {
  const cloned = [...products];
  switch (sortBy) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'newest':
      return cloned.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'popularity':
    default:
      return cloned.sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating);
  }
}
