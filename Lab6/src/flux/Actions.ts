import { AppDispatcher } from "./Dispatcher";
import { Product } from "../types/ProductTypes";

export const CounterActionTypes = {
  INCREMENT_COUNT: "INCREMENT_COUNT",
  DECREMENT_COUNT: "DECREMENT_COUNT",
};

export const UserActionTypes = {
  SAVE_USER: "SAVE_USER",
};

export const ProductActionTypes = {
  LOAD_PRODUCTS: "LOAD_PRODUCTS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

export const CartActionTypes = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
};

export const UIActionTypes = {
  TOGGLE_CART: "TOGGLE_CART",
  TOGGLE_CHECKOUT: "TOGGLE_CHECKOUT",
};

export const CacheActionTypes = {
  SAVE_TO_CACHE: "SAVE_TO_CACHE",
  LOAD_FROM_CACHE: "LOAD_FROM_CACHE",
  CLEAR_CACHE: "CLEAR_CACHE",
};

export const CounterActions = {
  increment: (value: number) => {
    AppDispatcher.dispatch({
      type: CounterActionTypes.INCREMENT_COUNT,
      payload: value,
    });
  },
  decrement: (value: number) => {
    AppDispatcher.dispatch({
      type: CounterActionTypes.DECREMENT_COUNT,
      payload: value,
    });
  },
};

export const UserActions = {
  saveUser: (user: { name: string; age: number }) => {
    AppDispatcher.dispatch({
      type: UserActionTypes.SAVE_USER,
      payload: user,
    });
  },
};

export const ProductActions = {
  loadProducts: (products: Product[]) => {
    AppDispatcher.dispatch({
      type: ProductActionTypes.LOAD_PRODUCTS,
      payload: products,
    });
  },

  setLoading: (isLoading: boolean) => {
    AppDispatcher.dispatch({
      type: ProductActionTypes.SET_LOADING,
      payload: isLoading,
    });
  },

  setError: (error: string | null) => {
    AppDispatcher.dispatch({
      type: ProductActionTypes.SET_ERROR,
      payload: error,
    });
  },
};

export const CartActions = {
  addToCart: (product: Product, quantity: number = 1) => {
    AppDispatcher.dispatch({
      type: CartActionTypes.ADD_TO_CART,
      payload: { product, quantity },
    });
  },

  removeFromCart: (productId: number) => {
    AppDispatcher.dispatch({
      type: CartActionTypes.REMOVE_FROM_CART,
      payload: productId,
    });
  },

  updateQuantity: (productId: number, quantity: number) => {
    AppDispatcher.dispatch({
      type: CartActionTypes.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  },

  clearCart: () => {
    AppDispatcher.dispatch({
      type: CartActionTypes.CLEAR_CART,
      payload: null,
    });
  },
};

export const UIActions = {
  toggleCart: () => {
    AppDispatcher.dispatch({
      type: UIActionTypes.TOGGLE_CART,
      payload: null,
    });
  },

  toggleCheckout: () => {
    AppDispatcher.dispatch({
      type: UIActionTypes.TOGGLE_CHECKOUT,
      payload: null,
    });
  },
};

export const CacheActions = {
  saveToCache: (key: string, data: unknown) => {
    AppDispatcher.dispatch({
      type: CacheActionTypes.SAVE_TO_CACHE,
      payload: { key, data },
    });
  },

  loadFromCache: (key: string) => {
    AppDispatcher.dispatch({
      type: CacheActionTypes.LOAD_FROM_CACHE,
      payload: key,
    });
  },

  clearCache: (key?: string) => {
    AppDispatcher.dispatch({
      type: CacheActionTypes.CLEAR_CACHE,
      payload: key,
    });
  },
};
