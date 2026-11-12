export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ProductCategory = 
  | 'Dresses' 
  | 'Kurtis' 
  | 'Tops' 
  | 'Co-ords' 
  | 'Sarees' 
  | 'Ethnic Wear';

export type DressSubcategory = 
  | 'Maxi Dresses' 
  | 'Midi Dresses' 
  | 'Short Dresses' 
  | 'Party Dresses';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory?: DressSubcategory;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string; // unique item id based on product.id + size + color
  productId: string;
  product: Product;
  size: ProductSize;
  color: string;
  quantity: number;
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRanges: string[];
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'newest';
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Confirmed' | 'Processing';
  address: Address;
  paymentMethod: 'UPI' | 'Cards' | 'Cash on Delivery';
  estimatedDelivery?: string;
  trackingUpdates?: { time: string; status: string; description: string }[];
}
