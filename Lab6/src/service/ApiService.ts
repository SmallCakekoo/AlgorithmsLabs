import { Product } from "../types/ProductTypes";

// Clave para almacenamiento en localStorage
const PRODUCTS_CACHE_KEY = "products_cache";

/**
 * Función principal para obtener productos de la Fake Store API
 */
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

/**
 * Obtener un producto específico por ID
 */
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

/**
 * Estrategia de caché: Cache First
 * Intenta usar caché primero, si no hay, va a la red.
 */
async function getProductsCacheFirst(): Promise<Product[]> {
  // Intentar recuperar productos del caché
  const cachedProducts = localStorage.getItem(PRODUCTS_CACHE_KEY);

  if (cachedProducts) {
    return JSON.parse(cachedProducts);
  }

  // Si no hay caché, obtener de la red y guardar en caché
  const products = await getProductsFromAPI();
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));

  return products;
}

/**
 * Estrategia de caché: Network Only
 * Siempre toma los datos de la red.
 */
function getProductsNetworkOnly(): Promise<Product[]> {
  return getProductsFromAPI();
}

export {
  getProductsFromAPI,
  getProductById,
  getProductsCacheFirst,
  getProductsNetworkOnly,
};
