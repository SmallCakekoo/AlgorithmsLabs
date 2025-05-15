import { AppDispatcher } from "./Dispatcher";
import { Product, CartItem } from "../types/ProductTypes";

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
