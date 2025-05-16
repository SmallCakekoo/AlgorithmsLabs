import { Product } from "../types/ProductTypes";

const PRODUCTS_CACHE_KEY = "products_cache";

function getProductsFromAPI(): Promise<Product[]> {
  return fetch("https://fakestoreapi.com/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
      return response.json() as Promise<Product[]>;
    })
    .catch((error) => {
      console.error("Error al obtener productos:", error);
      throw error;
    });
}

function getProductById(id: number): Promise<Product> {
  return fetch(`https://fakestoreapi.com/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`);
      }
      return response.json() as Promise<Product>;
    })
    .catch((error) => {
      console.error(`Error al obtener el producto ${id}:`, error);
      throw error;
    });
}

async function getProductsCacheFirst(): Promise<Product[]> {
  const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);

  if (cachedProducts) {
    return JSON.parse(cachedProducts);
  }

  const products = await getProductsFromAPI();
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));

  return products;
}

function getProductsNetworkOnly(): Promise<Product[]> {
  return getProductsFromAPI();
}

export {
  getProductsFromAPI,
  getProductById,
  getProductsCacheFirst,
  getProductsNetworkOnly,
};
