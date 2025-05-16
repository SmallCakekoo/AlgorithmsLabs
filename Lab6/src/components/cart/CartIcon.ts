import { store, State } from "../../flux/Store";
import { UIActions } from "../../flux/Actions";

class CartIcon extends HTMLElement {
  private state: State = store.getState();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(state: State) {
    this.state = state;
    this.render();
  }

  private getCartItemsCount(): number {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  private addEventListeners() {
    const button = this.shadowRoot?.querySelector(".cart-button");
    button?.addEventListener("click", () => {
      UIActions.toggleCart();
    });
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .cart-button {
        position: relative;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0.5rem;
        color: var(--primary-color, #4c7cff);
      }
      
      .cart-count {
        position: absolute;
        top: 0;
        right: 0;
        background: var(--accent-color, #ff6b6b);
        color: white;
        border-radius: 50%;
        width: 1.2rem;
        height: 1.2rem;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      
      .cart-icon {
        width: 1.8rem;
        height: 1.8rem;
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    const cartCount = this.getCartItemsCount();

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <button class="cart-button" aria-label="Ver carrito">
        <svg class="cart-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ""}
      </button>
    `;

    this.addEventListeners();
  }
}

customElements.define("cart-icon", CartIcon);
