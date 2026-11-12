'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, FilterState, Address, Order, ProductSize } from '@/lib/types';
import { PRODUCTS, INITIAL_ADDRESS, INITIAL_ORDERS } from '@/lib/data';
import { calculateSubtotal, calculateShipping, applyCoupon, calculateOrderTotal } from '@/lib/cart-utils';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

interface ShopContextType {
  // Auth & Firebase
  user: UserSession | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  pendingActionNotice: string;
  logoutUser: () => void;
  requireAuth: (notice?: string) => boolean;

  // Navigation & Views
  currentView: 'home' | 'shop' | 'product' | 'cart' | 'wishlist' | 'checkout' | 'account';
  setCurrentView: (view: 'home' | 'shop' | 'product' | 'cart' | 'wishlist' | 'checkout' | 'account') => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  openProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: ProductSize, color?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  cartSubtotal: number;
  cartShipping: number;
  cartDiscount: number;
  cartTotal: number;
  cartCount: number;
  couponCode: string;
  couponMessage: string;
  applyCouponCode: (code: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;

  // Checkout & Orders
  shippingAddress: Address;
  setShippingAddress: (addr: Address) => void;
  orders: Order[];
  placedOrder: Order | null;
  checkoutStep: 1 | 2 | 3;
  setCheckoutStep: (step: 1 | 2 | 3) => void;
  placeOrder: (paymentMethod: 'UPI' | 'Cards' | 'Cash on Delivery') => Promise<Order>;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info') => void;

  // Size Guide Modal
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;

  // Tracking Modal
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;

  // Catalog from Turso
  products: Product[];
  collections: any[];
  banners: any[];
}

const defaultFilters: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  priceRanges: [],
  sortBy: 'popularity',
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'cart' | 'wishlist' | 'checkout' | 'account'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('floral-maxi-dress');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // User Auth & Firebase Firestore State
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingActionNotice, setPendingActionNotice] = useState('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Catalog from Turso database - starts empty for real-time load
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);

  const [isCatalogLoaded, setIsCatalogLoaded] = useState(false);

  useEffect(() => {
    if (isCatalogLoaded) return;
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.products)) setProducts(data.products);
          if (Array.isArray(data.collections)) setCollections(data.collections);
          if (Array.isArray(data.banners)) setBanners(data.banners);
          setIsCatalogLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Catalog fetch error:', err);
      });
  }, [isCatalogLoaded]);

  // Listen to Firebase Auth state and load user activity data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const currentUserSession: UserSession = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Aurelle Shopper',
          email: firebaseUser.email || '',
        };
        setUser(currentUserSession);

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          // Only sync user profile if it's a valid session
          await setDoc(userDocRef, {
            id: firebaseUser.uid,
            name: currentUserSession.name,
            email: currentUserSession.email,
            lastLogin: new Date().toISOString(),
          }, { merge: true });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }

        // Fetch cart items
        try {
          const cartColRef = collection(db, `users/${firebaseUser.uid}/cartItems`);
          const cartSnap = await getDocs(cartColRef);
          const loadedCart: CartItem[] = [];
          cartSnap.forEach((d) => {
            const data = d.data() as CartItem;
            // Attach product object from products list if found
            const prod = products.find((p) => p.id === data.productId) || PRODUCTS.find((p) => p.id === data.productId);
            if (prod) {
              loadedCart.push({ ...data, product: prod });
            }
          });
          setCart(loadedCart);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/cartItems`);
        }

        // Fetch wishlist items
        try {
          const wishColRef = collection(db, `users/${firebaseUser.uid}/wishlistItems`);
          const wishSnap = await getDocs(wishColRef);
          const loadedWish: string[] = [];
          wishSnap.forEach((d) => {
            const data = d.data();
            if (data.productId) loadedWish.push(data.productId);
          });
          setWishlist(loadedWish);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/wishlistItems`);
        }

        // Fetch orders
        try {
          const ordersColRef = collection(db, `users/${firebaseUser.uid}/orders`);
          const ordersSnap = await getDocs(ordersColRef);
          const loadedOrders: Order[] = [];
          ordersSnap.forEach((d) => {
            loadedOrders.push(d.data() as Order);
          });
          setOrders(loadedOrders);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/orders`);
        }
      } else {
        setUser(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, [products]);

  const requireAuth = (notice: string = 'Please log in with Google to manage your bag, wishlist, and orders.'): boolean => {
    if (!user) {
      setPendingActionNotice(notice);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCart([]);
      setWishlist([]);
      showToast('Logged out successfully', 'info');
    } catch (error) {
      showToast('Error logging out', 'info');
    }
  };

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [couponCode, setCouponCode] = useState('AURELLE10');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('Code AURELLE10 ready');

  const [shippingAddress, setShippingAddress] = useState<Address>(INITIAL_ADDRESS);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Wishlist toggle & Firestore persistence
  const toggleWishlist = async (productId: string) => {
    if (!requireAuth('Log in with Google to save outfits to your wishlist!')) return;
    if (!user) return;

    const exists = wishlist.includes(productId);
    const newWishlist = exists ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];

    setWishlist(newWishlist);

    const wishDocPath = `users/${user.id}/wishlistItems/${productId}`;
    try {
      if (exists) {
        await deleteDoc(doc(db, 'users', user.id, 'wishlistItems', productId));
      } else {
        await setDoc(doc(db, 'users', user.id, 'wishlistItems', productId), {
          id: productId,
          productId,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, wishDocPath);
    }

    const prod = PRODUCTS.find((p) => p.id === productId);
    const name = prod ? prod.name : 'Item';
    showToast(exists ? `Removed ${name} from Wishlist` : `Saved ${name} to Wishlist!`, 'info');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const addToCart = async (
    product: Product,
    size: ProductSize = 'M',
    color: string = product.colors[0]?.name || 'Standard',
    quantity: number = 1
  ) => {
    if (!requireAuth(`Log in with Google to add ${product.name} to your bag!`)) return;
    if (!user) return;

    const cartItemId = `${product.id}-${color}-${size}`.toLowerCase().replace(/\s+/g, '-');
    let updatedCart: CartItem[] = [];

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
      } else {
        updatedCart = [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            size,
            color,
            quantity,
          },
        ];
      }
      return updatedCart;
    });

    const itemRef = doc(db, 'users', user.id, 'cartItems', cartItemId);
    const cartItemPath = `users/${user.id}/cartItems/${cartItemId}`;
    try {
      const targetItem = updatedCart.find((i) => i.id === cartItemId);
      if (targetItem) {
        await setDoc(itemRef, {
          id: targetItem.id,
          productId: targetItem.productId,
          size: targetItem.size,
          color: targetItem.color,
          quantity: targetItem.quantity,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, cartItemPath);
    }

    showToast(`Added ${product.name} (${color} | ${size}) to your Bag!`, 'success');
  };

  const removeFromCart = async (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    if (user) {
      const path = `users/${user.id}/cartItems/${cartItemId}`;
      try {
        await deleteDoc(doc(db, 'users', user.id, 'cartItems', cartItemId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
    showToast('Item removed from shopping bag', 'info');
  };

  const updateQuantity = async (cartItemId: string, delta: number) => {
    let updatedItem: CartItem | undefined;
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            updatedItem = newQty > 0 ? { ...item, quantity: newQty } : undefined;
            return updatedItem || null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );

    if (user) {
      const path = `users/${user.id}/cartItems/${cartItemId}`;
      try {
        if (!updatedItem) {
          await deleteDoc(doc(db, 'users', user.id, 'cartItems', cartItemId));
        } else {
          await setDoc(doc(db, 'users', user.id, 'cartItems', cartItemId), {
            id: updatedItem.id,
            productId: updatedItem.productId,
            size: updatedItem.size,
            color: updatedItem.color,
            quantity: updatedItem.quantity,
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyCouponCode = (code: string) => {
    setCouponCode(code);
    const sub = calculateSubtotal(cart);
    const res = applyCoupon(sub, code);
    if (res.valid) {
      setCouponDiscount(res.discount);
      setCouponMessage(res.message);
      showToast(res.message, 'success');
    } else {
      setCouponDiscount(0);
      setCouponMessage(res.message);
      showToast(res.message, 'info');
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  const placeOrder = async (paymentMethod: 'UPI' | 'Cards' | 'Cash on Delivery'): Promise<Order> => {
    const subtotal = calculateSubtotal(cart);
    const shipping = calculateShipping(subtotal);
    const total = calculateOrderTotal(subtotal, shipping, couponDiscount);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `AUL${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
      address: shippingAddress,
      paymentMethod,
      estimatedDelivery: '3 - 5 Business Days',
      trackingUpdates: [
        {
          time: 'Just now',
          status: 'Order Placed',
          description: `Order received with ${paymentMethod} payment. Preparing for dispatch.`,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setPlacedOrder(newOrder);
    setCheckoutStep(3);
    setCart([]);

    if (user) {
      const orderPath = `users/${user.id}/orders/${newOrder.id}`;
      try {
        await setDoc(doc(db, 'users', user.id, 'orders', newOrder.id), newOrder);
        // Clear cart items in Firestore
        for (const item of cart) {
          await deleteDoc(doc(db, 'users', user.id, 'cartItems', item.id));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, orderPath);
      }
    }

    showToast(`Order #${newOrder.orderNumber} successfully placed!`, 'success');
    return newOrder;
  };

  // Calculations
  const cartSubtotal = calculateSubtotal(cart);
  const cartShipping = calculateShipping(cartSubtotal);
  const cartTotal = calculateOrderTotal(cartSubtotal, cartShipping, couponDiscount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        pendingActionNotice,
        logoutUser,
        requireAuth,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        openProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartSubtotal,
        cartShipping,
        cartDiscount: couponDiscount,
        cartTotal,
        cartCount,
        couponCode,
        couponMessage,
        applyCouponCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        resetFilters,
        shippingAddress,
        setShippingAddress,
        orders,
        placedOrder,
        checkoutStep,
        setCheckoutStep,
        placeOrder,
        toasts,
        showToast,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        trackingOrder,
        setTrackingOrder,
        products,
        collections,
        banners,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
