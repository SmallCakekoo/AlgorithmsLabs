import { store, State } from "../flux/Store";
import { CartActions } from "../flux/Actions";
import { getProductById } from "../service/ApiService";
import { Product } from "../types/ProductTypes";

class ProductDetailPage extends HTMLElement {
  private state: State = store.getState();
  private product: Product | null = null;
  private isLoading: boolean = false;
  private error: string | null = null;

  static get observedAttributes() {
    return ["product-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    this.render();
    this.loadProduct();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "product-id" && oldValue !== newValue && this.isConnected) {
      this.loadProduct();
    }
  }

  private handleStateChange(state: State) {
    this.state = state;
    this.render();
  }

  private async loadProduct() {
    const productId = this.getAttribute("product-id");
    if (!productId) return;

    try {
      this.isLoading = true;
      this.error = null;
      this.render();

      // Primero busca en el store para ver si ya tenemos el producto
      const productInStore = this.state.products.find(
        (p) => p.id.toString() === productId
      );

      if (productInStore) {
        this.product = productInStore;
      } else {
        // Si no está en el store, obtenerlo de la API
        this.product = await getProductById(parseInt(productId));
      }

      this.isLoading = false;
      this.render();
    } catch (error) {
      this.isLoading = false;
      this.error = "Error al cargar el producto";
      this.render();
      console.error(error);
    }
  }

  private addEventListeners() {
    const addToCartBtn = this.shadowRoot?.querySelector(".add-to-cart-btn");
    const quantityInput = this.shadowRoot?.querySelector(
      "#quantity"
    ) as HTMLInputElement;
    const backButton = this.shadowRoot?.querySelector(".back-button");

    addToCartBtn?.addEventListener("click", () => {
      if (this.product) {
        const quantity = parseInt(quantityInput?.value || "1");
        CartActions.addToCart(this.product, quantity);

        const message = this.shadowRoot?.querySelector(".success-message");
        if (message) {
          message.classList.add("visible");
          setTimeout(() => {
            message.classList.remove("visible");
          }, 2000);
        }
      }
    });

    backButton?.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .loading {
        display: flex;
        justify-content: center;
        padding: 2rem 0;
      }
      
      .error {
        color: var(--accent-color, #ff6b6b);
        padding: 1rem;
        border: 1px solid var(--accent-color, #ff6b6b);
        border-radius: 4px;
        margin: 1rem 0;
      }
      
      .product-detail {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        margin: 2rem 0;
      }
      
      .product-image {
        flex: 1;
        min-width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f7f7;
        padding: 2rem;
        border-radius: 8px;
      }
      
      .product-image img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
      }
      
      .product-info {
        flex: 1;
        min-width: 300px;
      }
      
      .product-category {
        font-size: 0.9rem;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
      
      .product-title {
        margin: 0 0 1rem;
        font-size: 1.8rem;
        color: var(--text-color, #333);
      }
      
      .product-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color, #4c7cff);
        margin-bottom: 1.5rem;
      }
      
      .product-description {
        margin-bottom: 2rem;
        line-height: 1.6;
        color: #444;
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      
      .quantity-label {
        margin-right: 1rem;
        font-weight: 600;
      }
      
      #quantity {
        width: 3rem;
        padding: 0.5rem;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .add-to-cart-btn {
        background: var(--primary-color, #4c7cff);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      
      .add-to-cart-btn:hover {
        background: var(--primary-color-dark, #3a5dbe);
      }
      
      .back-button {
        display: inline-block;
        margin-bottom: 1rem;
        color: var(--text-color, #333);
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }
      
      .back-button:hover {
        color: var(--primary-color, #4c7cff);
      }
      
      .success-message {
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        margin-top: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .success-message.visible {
        opacity: 1;
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      
      <a class="back-button">← Volver a la tienda</a>
      
      ${
        this.isLoading
          ? `
        <div class="loading">
          <p>Cargando producto...</p>
        </div>
      `
          : ""
      }
      
      ${
        this.error
          ? `
        <div class="error">
          ${this.error}
        </div>
      `
          : ""
      }
      
      ${
        this.product
          ? `
        <div class="product-detail">
          <div class="product-image">
            <img src="${this.product.image}" alt="${this.product.title}">
          </div>
          
          <div class="product-info">
            <div class="product-category">${this.product.category}</div>
            <h1 class="product-title">${this.product.title}</h1>
            <div class="product-price">$${this.product.price.toFixed(2)}</div>
            <p class="product-description">${this.product.description}</p>
            
            <div class="quantity-control">
              <label for="quantity" class="quantity-label">Cantidad:</label>
              <input type="number" id="quantity" min="1" value="1">
            </div>
            
            <button class="add-to-cart-btn">Agregar al carrito</button>
            
            <div class="success-message">
              Producto agregado al carrito!
            </div>
          </div>
        </div>
      `
          : ""
      }
    `;

    if (this.product) {
      this.addEventListeners();
    }
  }
}

customElements.define("product-detail-page", ProductDetailPage);
