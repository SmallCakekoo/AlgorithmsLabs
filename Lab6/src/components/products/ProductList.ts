import { store, State } from "../../flux/Store";
import { CartActions } from "../../flux/Actions";
import "./ProductCard";

class ProductList extends HTMLElement {
  private state: State = store.getState();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    this.render();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: State) {
    this.state = state;
    this.render();
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .empty-products {
        text-align: center;
        padding: 2rem;
        background: #f9f9f9;
        border-radius: 4px;
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      
      ${
        this.state.products.length === 0 && !this.state.isLoading
          ? `
        <div class="empty-products">
          <p>No hay productos disponibles</p>
        </div>
      `
          : ""
      }
      
      <div class="products-grid">
        ${this.state.products
          .map(
            (product) => `
          <product-card
            data-id="${product.id}"
            data-title="${product.title}"
            data-price="${product.price}"
            data-image="${product.image}"
            data-description="${product.description.replace(/"/g, "&quot;")}"
            data-category="${product.category}"
          ></product-card>
        `
          )
          .join("")}
      </div>
    `;

    // Agregar eventos a los botones después de renderizar
    this.addEventListeners();
  }

  private addEventListeners() {
    const cards = this.shadowRoot?.querySelectorAll("product-card");
    cards?.forEach((card) => {
      card.addEventListener("add-to-cart", (e: Event) => {
        const productId = parseInt(
          (e.target as HTMLElement).getAttribute("data-id") || "0"
        );
        const product = this.state.products.find((p) => p.id === productId);

        if (product) {
          CartActions.addToCart(product, 1);
        }
      });
    });
  }
}

customElements.define("product-list", ProductList);
