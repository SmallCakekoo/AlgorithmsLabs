import "../components/products/ProductList";

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .hero {
        background: linear-gradient(135deg, var(--primary-color, #4c7cff), #6a5acd);
        color: white;
        padding: 3rem 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
      }
      
      .hero h2 {
        margin-top: 0;
        font-size: 2.2rem;
      }
      
      .hero p {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        opacity: 0.9;
      }
      
      .section-title {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: var(--text-color, #333);
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      
      <div class="hero">
        <h2>Bienvenido a MiTienda</h2>
        <p>Descubre nuestra selección de productos de alta calidad a los mejores precios.</p>
      </div>
      
      <h2 class="section-title">Nuestros Productos</h2>
      <product-list></product-list>
    `;
  }
}

customElements.define("home-page", HomePage);
