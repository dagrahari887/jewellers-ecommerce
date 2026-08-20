import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  purity?: string;
  metalType?: string;
  size?: string; // Ring size (e.g. "14") or bracelet size (e.g. "M")
}

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  purity?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppState {
  // Authentication
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getAuthHeader: () => Record<string, string>;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;

  // Toast notifications
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      cart: [],
      wishlist: [],
      toasts: [],

      // AUTH
      setUser: (user) => set({ user }),

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, cart: [], wishlist: [] });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      getAuthHeader: (): Record<string, string> => {
        const token = get().token || localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // CART
      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.productId === item.productId && i.size === item.size);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      removeFromCart: (productId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.productId !== productId) })),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      cartCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      // WISHLIST
      addToWishlist: (item) =>
        set((state) => {
          if (state.wishlist.some((i) => i.productId === item.productId)) return state;
          return { wishlist: [...state.wishlist, item] };
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({ wishlist: state.wishlist.filter((i) => i.productId !== productId) })),

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlist.some((i) => i.productId === item.productId);
          if (exists) return { wishlist: state.wishlist.filter((i) => i.productId !== item.productId) };
          return { wishlist: [...state.wishlist, item] };
        }),

      isInWishlist: (productId) => {
        return get().wishlist.some((i) => i.productId === productId);
      },

      // TOASTS
      addToast: (type, message) => {
        const id = `toast_${Date.now()}`;
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 4000);
      },

      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'baikunthh-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);

// API helper
export const API_URL = 'http://localhost:5000/api';

export const apiRequest = async (
  path: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = useStore.getState().token || localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};