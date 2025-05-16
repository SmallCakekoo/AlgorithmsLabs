import { AppDispatcher, Action } from "./Dispatcher";
import {
  CounterActionTypes,
  UserActionTypes,
  ProductActionTypes,
  CartActionTypes,
  CacheActionTypes,
  UIActionTypes,
} from "./Actions";
import { Product, CartItem } from "../types/ProductTypes";

export type User = {
  name: string;
  age: number;
};

export type CacheData = {
  data: unknown;
  timestamp: number;
  expiry?: number;
};

export type State = {
  count: number;
  user: User | null;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
  cachedData: Record<string, CacheData>;
  ui: {
    isCartOpen: boolean;
    isCheckoutOpen: boolean;
  };
};

type Listener = (state: State) => void;

const CART_STORAGE_KEY = "ecommerce_cart";
const CACHE_PREFIX = "ecommerce_cache_";

type AddToCartPayload = {
  product: Product;
  quantity: number;
};

class Store {
  private _myState: State = {
    count: 0,
    user: null,
    products: [],
    isLoading: false,
    error: null,
    cart: [],
    cachedData: {},
    ui: {
      isCartOpen: false,
      isCheckoutOpen: false,
    },
  };
  private _listeners: Listener[] = [];
  private _cache: Map<string, CacheData> = new Map();

  constructor() {
    AppDispatcher.register(this._handleActions.bind(this)); // Bind the context of this method to the Store instance

    this._loadCartFromStorage();
    this._loadAllCacheEntries();
  }

  getState() {
    return this._myState;
  }

  _handleActions(action: Action): void {
    switch (action.type) {
      case CounterActionTypes.INCREMENT_COUNT:
        if (typeof action.payload === "number") {
          this._myState = {
            ...this._myState,
            count: this._myState.count + action.payload,
          };
        }
        this._emitChange();
        break;

      case CounterActionTypes.DECREMENT_COUNT:
        if (typeof action.payload === "number") {
          this._myState = {
            ...this._myState,
            count: this._myState.count - action.payload,
          };
        }
        this._emitChange();
        break;

      case UserActionTypes.SAVE_USER:
        if (typeof action.payload === "object" && action.payload !== null) {
          this._myState = {
            ...this._myState,
            user: action.payload as User,
          };
        }
        this._emitChange();
        break;

      case ProductActionTypes.LOAD_PRODUCTS:
        if (Array.isArray(action.payload)) {
          this._myState = {
            ...this._myState,
            products: action.payload as Product[],
          };
        }
        this._emitChange();
        break;

      case ProductActionTypes.SET_LOADING:
        if (typeof action.payload === "boolean") {
          this._myState = {
            ...this._myState,
            isLoading: action.payload,
          };
        }
        this._emitChange();
        break;

      case ProductActionTypes.SET_ERROR:
        this._myState = {
          ...this._myState,
          error: action.payload as string | null,
        };
        this._emitChange();
        break;

      case CartActionTypes.ADD_TO_CART:
        if (action.payload !== null && typeof action.payload === "object") {
          this._addToCart(action.payload as AddToCartPayload);
          this._saveCartToStorage();
        }
        this._emitChange();
        break;

      case CartActionTypes.REMOVE_FROM_CART:
        if (typeof action.payload === "number") {
          this._myState = {
            ...this._myState,
            cart: this._myState.cart.filter(
              (item) => item.id !== action.payload
            ),
          };
          this._saveCartToStorage();
        }
        this._emitChange();
        break;

      case CartActionTypes.UPDATE_QUANTITY:
        if (
          action.payload !== null &&
          typeof action.payload === "object" &&
          "productId" in action.payload &&
          "quantity" in action.payload
        ) {
          const { productId, quantity } = action.payload as {
            productId: number;
            quantity: number;
          };

          this._myState = {
            ...this._myState,
            cart: this._myState.cart.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
          this._saveCartToStorage();
        }
        this._emitChange();
        break;

      case CartActionTypes.CLEAR_CART:
        this._myState = {
          ...this._myState,
          cart: [],
        };
        this._saveCartToStorage();
        this._emitChange();
        break;

      case UIActionTypes.TOGGLE_CART:
        this._myState = {
          ...this._myState,
          ui: {
            ...this._myState.ui,
            isCartOpen: !this._myState.ui.isCartOpen,
            // Si abrimos el carrito, cerramos el checkou
            isCheckoutOpen: false,
          },
        };
        this._emitChange();
        break;

      case UIActionTypes.TOGGLE_CHECKOUT:
        this._myState = {
          ...this._myState,
          ui: {
            ...this._myState.ui,
            isCheckoutOpen: !this._myState.ui.isCheckoutOpen,
            // Si abrimos el checkout, cerramos el carrito
            isCartOpen: false,
          },
        };
        this._emitChange();
        break;

      case CacheActionTypes.SAVE_TO_CACHE:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "key" in action.payload &&
          "data" in action.payload
        ) {
          const { key, data } = action.payload as {
            key: string;
            data: unknown;
          };
          this._saveToCache(key, data);
          // Actualizar el estado con los datos cacheados
          this._myState = {
            ...this._myState,
            cachedData: {
              ...this._myState.cachedData,
              [key]: {
                data,
                timestamp: Date.now(),
              },
            },
          };
          this._emitChange();
        }
        break;

      case CacheActionTypes.LOAD_FROM_CACHE:
        if (typeof action.payload === "string") {
          const key = action.payload;
          const data = this._loadFromCache(key);
          if (data !== null) {
            // Actualizar el estado con los datos cargados del caché
            this._myState = {
              ...this._myState,
              cachedData: {
                ...this._myState.cachedData,
                [key]: data,
              },
            };
            this._emitChange();
          }
        }
        break;

      case CacheActionTypes.CLEAR_CACHE:
        if (action.payload === undefined) {
          // Limpiar todo el caché
          this._clearAllCache();
          // Actualizar el estado
          this._myState = {
            ...this._myState,
            cachedData: {},
          };
          this._emitChange();
        } else if (typeof action.payload === "string") {
          // Limpiar una entrada específica del caché
          const key = action.payload;
          this._clearCacheEntry(key);
          // Actualizar el estado
          const newCachedData = { ...this._myState.cachedData };
          delete newCachedData[key];
          this._myState = {
            ...this._myState,
            cachedData: newCachedData,
          };
          this._emitChange();
        }
        break;
    }
  }

  private _addToCart(payload: AddToCartPayload): void {
    if (
      payload !== null &&
      typeof payload === "object" &&
      "product" in payload &&
      "quantity" in payload
    ) {
      const { product, quantity } = payload;
      const existingItemIndex = this._myState.cart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Actualizar cantidad si el producto ya está en el carrito
        const updatedCart = [...this._myState.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };

        this._myState = {
          ...this._myState,
          cart: updatedCart,
        };
      } else {
        // Agregar nuevo producto al carrito
        const cartItem: CartItem = {
          ...product,
          quantity,
        };

        this._myState = {
          ...this._myState,
          cart: [...this._myState.cart, cartItem],
        };
      }
    }
  }

  private _saveCartToStorage(): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this._myState.cart));
  }

  private _loadCartFromStorage(): void {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          this._myState = {
            ...this._myState,
            cart: parsedCart,
          };
        }
      } catch (e) {
        console.error("Error al cargar el carrito desde localStorage:", e);
      }
    }
  }

  private _saveToCache(key: string, data: unknown): void {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };

    this._cache.set(key, cacheData);

    try {
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (e) {
      console.error(`Error al guardar en caché la clave ${key}:`, e);
    }
  }

  private _loadFromCache(key: string): CacheData | null {
    // Primero intentar desde la memoria
    if (this._cache.has(key)) {
      return this._cache.get(key) || null;
    }

    try {
      const cachedData = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as CacheData;
        // Actualizar la memoria caché
        this._cache.set(key, parsedData);
        return parsedData;
      }
    } catch (e) {
      console.error(`Error al cargar del caché la clave ${key}:`, e);
    }

    return null;
  }

  private _clearCacheEntry(key: string): void {
    this._cache.delete(key);

    try {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (e) {
      console.error(`Error al eliminar del caché la clave ${key}:`, e);
    }
  }

  private _clearAllCache(): void {
    this._cache.clear();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Error al limpiar todo el caché:", e);
    }
  }

  private _loadAllCacheEntries(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          const cacheKey = key.substring(CACHE_PREFIX.length);
          const cachedData = localStorage.getItem(key);
          if (cachedData) {
            try {
              const parsedData = JSON.parse(cachedData) as CacheData;
              this._cache.set(cacheKey, parsedData);
            } catch (e) {
              console.error(
                `Error al parsear datos del caché para la clave ${cacheKey}:`,
                e
              );
            }
          }
        }
      });
    } catch (e) {
      console.error("Error al cargar todas las entradas del caché:", e);
    }
  }

  // Método para obtener una entrada de caché ??
  getCacheEntry(key: string): CacheData | null {
    return this._loadFromCache(key);
  }

  // Método para obtener datos cacheados del estado (siguiendo el patrón Flux)
  getCachedData(key: string): CacheData | undefined {
    return this._myState.cachedData[key];
  }

  private _emitChange(): void {
    const state = this.getState();
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this.getState());
  }

  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
}

export const store = new Store();
