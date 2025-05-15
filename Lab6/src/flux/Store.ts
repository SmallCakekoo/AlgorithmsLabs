import { AppDispatcher, Action } from "./Dispatcher";
import {
  CounterActionTypes,
  UserActionTypes,
  ProductActionTypes,
  CartActionTypes,
} from "./Actions";
import { Product, CartItem } from "../types/ProductTypes";

export type User = {
  name: string;
  age: number;
};

export type State = {
  count: number;
  user: User | null;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
};

type Listener = (state: State) => void;

// Clave para persistir el carrito en localStorage
const CART_STORAGE_KEY = "ecommerce_cart";

class Store {
  private _myState: State = {
    count: 0,
    user: null,
    products: [],
    isLoading: false,
    error: null,
    cart: [],
  };
  // Los componentes
  private _listeners: Listener[] = [];

  constructor() {
    AppDispatcher.register(this._handleActions.bind(this)); // Bind the context of this method to the Store instance

    // Cargar carrito desde localStorage al iniciar
    this._loadCartFromStorage();
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
        if (action.payload !== null) {
          this._addToCart(action.payload);
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
    }
  }

  private _addToCart(payload: any): void {
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

  private _emitChange(): void {
    const state = this.getState();
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  // Permite a los componentes suscribirse al store
  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this.getState()); // Emitir estado actual al suscribirse
  }

  // Permite quitar la suscripción
  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
}

export const store = new Store();
