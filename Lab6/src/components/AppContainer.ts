import { State, store } from "../flux/Store";
import { getProductsCacheFirst } from "../service/ApiService";
import { ProductActions } from "../flux/Actions";
import "./products/ProductList";
import "./cart/CartIcon";
import "./cart/CartSidebar";
import "../pages/HomePage";
import "../pages/ProductDetailPage";

class AppContainer extends HTMLElement {
  private state: State = store.getState();
  private currentPath: string = window.location.pathname;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));

    window.addEventListener("popstate", this.handleRouteChange.bind(this));

    this.render();
    this.loadProducts();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
    window.removeEventListener("popstate", this.handleRouteChange.bind(this));
  }

  private handleStateChange(state: State) {
    this.state = state;
    this.render();
  }

  private handleRouteChange() {
    this.currentPath = window.location.pathname;
    this.render();
  }

  private async loadProducts() {
    try {
      ProductActions.setLoading(true);
      const products = await getProductsCacheFirst();
      ProductActions.loadProducts(products);
      ProductActions.setLoading(false);
    } catch (error) {
      ProductActions.setError("Error al cargar productos");
      ProductActions.setLoading(false);
      throw error;
    }
  }

  private getStyles() {
    return `
      :host {
        display: block;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        --primary-color: #4c7cff;
        --secondary-color: #f3f3f3;
        --text-color: #333;
        --accent-color: #ff6b6b;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
      }
      
      h1 {
        margin: 0;
        color: var(--primary-color);
      }
      
      .main-content {
        padding: 2rem 0;
        position: relative;
      }
      
      .loading {
        display: flex;
        justify-content: center;
        padding: 2rem 0;
      }
      
      .error {
        color: var(--accent-color);
        padding: 1rem;
        border: 1px solid var(--accent-color);
        border-radius: 4px;
        margin: 1rem 0;
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        display: ${this.state.ui.isCartOpen ? "block" : "none"};
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container">
        <header>
          <h1>MiiiTienda</h1>
          <cart-icon></cart-icon>
        </header>
        
        <main class="main-content">
          ${
            this.state.isLoading
              ? `
            <div class="loading">
              <p>Cargando productos...</p>
            </div>
          `
              : ""
          }
          
          ${
            this.state.error
              ? `
            <div class="error">
              ${this.state.error}
            </div>
          `
              : ""
          }
          
          ${this.renderCurrentPage()}
        </main>
        
        <cart-sidebar ${this.state.ui.isCartOpen ? "open" : ""}></cart-sidebar>
      </div>
    `;

    const backButton = this.shadowRoot.querySelector(".back-button");
    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.preventDefault();
        window.history.pushState({}, "", "/");
        this.handleRouteChange();
      });
    }
  }

  private renderCurrentPage(): string {
    if (this.currentPath.startsWith("/product/")) {
      const productId = this.currentPath.split("/").pop();
      return `<product-detail-page product-id="${productId}"></product-detail-page>`;
    } else {
      return `<home-page></home-page>`;
    }
  }
}

export default AppContainer;
