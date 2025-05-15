class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  static get observedAttributes() {
    return [
      "data-id",
      "data-title",
      "data-price",
      "data-image",
      "data-description",
      "data-category",
    ];
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .card {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: white;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }
      
      .card-image {
        height: 200px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background:rgb(255, 255, 255);
        padding: 1rem;
      }
      
      .card-image img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
      }
      
      .card-content {
        padding: 1rem;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      
      .card-title {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .card-category {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }
      
      .card-price {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--primary-color, #4c7cff);
        margin: auto 0 1rem;
      }
      
      .btn {
        background: var(--primary-color, #4c7cff);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.3s ease;
        width: 100%;
      }
      
      .btn:hover {
        background: var(--primary-color-dark, #3a5dbe);
      }
    `;
  }

  private addEventListeners() {
    const addToCartBtn = this.shadowRoot?.querySelector(".add-to-cart-btn");
    addToCartBtn?.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("add-to-cart", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  render() {
    if (!this.shadowRoot) return;

    const title = this.getAttribute("data-title") || "Producto sin título";
    const price = parseFloat(this.getAttribute("data-price") || "0");
    const image = this.getAttribute("data-image") || "";
    const category = this.getAttribute("data-category") || "";

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="card">
        <div class="card-image">
          <img src="${image}" alt="${title}" loading="lazy">
        </div>
        <div class="card-content">
          <div class="card-category">${category}</div>
          <h3 class="card-title" title="${title}">${title}</h3>
          <div class="card-price">$${price.toFixed(2)}</div>
          <button class="btn add-to-cart-btn">Agregar al carrito</button>
        </div>
      </div>
    `;
  }
}

customElements.define("product-card", ProductCard);
