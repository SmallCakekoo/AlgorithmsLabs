import { store, State } from "../../flux/Store";
import { CartActions } from "../../flux/Actions";
import { CartItem } from "../../types/ProductTypes";
import "./CheckoutForm";

class CartSidebar extends HTMLElement {
  private state: State = store.getState();
  private isCheckoutOpen: boolean = false;

  static get observedAttributes() {
    return ["open"];
  }

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

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "open" && this.isConnected && oldValue !== newValue) {
      this.render();
    }
  }

  private handleStateChange(state: State) {
    this.state = state;
    this.render();
  }

  private isOpen(): boolean {
    return this.hasAttribute("open");
  }

  private getCartTotal(): number {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private handleClose = () => {
    this.removeAttribute("open");
  };

  private handleQuantityChange = (id: number, action: string) => {
    const currentItem = this.state.cart.find((item) => item.id === id);
    if (!currentItem) return;

    if (action === "decrease" && currentItem.quantity === 1) {
      CartActions.removeFromCart(id);
    } else {
      const newQuantity =
        action === "increase"
          ? currentItem.quantity + 1
          : currentItem.quantity - 1;
      CartActions.updateQuantity(id, newQuantity);
    }
  };

  private handleRemoveItem = (id: number) => {
    CartActions.removeFromCart(id);
  };

  private handleCheckout = () => {
    this.isCheckoutOpen = true;
    this.render();
  };

  private handleCheckoutClose = () => {
    this.isCheckoutOpen = false;
    this.render();
  };

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        opacity: ${this.isOpen() ? "1" : "0"};
        visibility: ${this.isOpen() ? "visible" : "hidden"};
        z-index: 99;
      }
      
      .sidebar {
        position: fixed;
        top: 0;
        right: 0;
        width: 350px;
        max-width: 90vw;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
        transform: translateX(${this.isOpen() ? "0" : "100%"});
        display: flex;
        flex-direction: column;
      }
      
      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }
      
      .sidebar-title {
        margin: 0;
        font-size: 1.2rem;
      }
      
      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }
      
      .cart-item {
        display: flex;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }
      
      .item-image {
        width: 70px;
        height: 70px;
        object-fit: contain;
        margin-right: 1rem;
        background: #f7f7f7;
      }
      
      .item-details {
        flex: 1;
      }
      
      .item-title {
        margin: 0 0 0.25rem;
        font-size: 0.9rem;
        font-weight: 600;
      }
      
      .item-price {
        font-weight: bold;
        color: var(--primary-color, #4c7cff);
        margin-bottom: 0.5rem;
      }
      
      .quantity-control {
        display: flex;
        align-items: center;
      }
      
      .quantity-btn {
        width: 24px;
        height: 24px;
        background: #f1f1f1;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .quantity {
        margin: 0 0.5rem;
        font-weight: 600;
      }
      
      .remove-btn {
        background: none;
        border: none;
        color: var(--accent-color, #ff6b6b);
        cursor: pointer;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        padding: 0;
        text-align: left;
      }
      
      .sidebar-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
      }
      
      .cart-total {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }
      
      .btn {
        width: 100%;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 0.5rem;
      }
      
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .checkout-btn {
        background: var(--primary-color, #4c7cff);
        color: white;
      }
      
      .clear-cart-btn {
        background: var(--secondary-color, #f3f3f3);
        color: var(--text-color, #333);
      }
      
      .empty-cart {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

    const cartItems = this.state.cart;
    const total = this.getCartTotal();

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="overlay" onclick="this.getRootNode().host.handleClose()"></div>
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Tu carrito</h3>
        </div>
        
        <div class="cart-items">
          ${
            cartItems.length === 0
              ? `
            <div class="empty-cart">
              <p>Tu carrito está vacío</p>
            </div>
          `
              : cartItems.map((item) => this.renderCartItem(item)).join("")
          }
        </div>
        
        <div class="sidebar-footer">
          <div class="cart-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
          
          <button class="btn checkout-btn" ${
            cartItems.length === 0 ? "disabled" : ""
          } onclick="this.getRootNode().host.handleCheckout()">
            Finalizar compra
          </button>
          
          <button class="btn clear-cart-btn" ${
            cartItems.length === 0 ? "disabled" : ""
          } onclick="CartActions.clearCart()">
            Vaciar carrito
          </button>
        </div>
      </aside>
      
      ${this.isCheckoutOpen ? `<checkout-form></checkout-form>` : ""}
    `;
  }

  private renderCartItem(item: CartItem): string {
    return `
      <div class="cart-item">
        <img class="item-image" src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h4 class="item-title">${item.title}</h4>
          <div class="item-price">$${item.price.toFixed(2)}</div>
          
          <div class="quantity-control">
            <button class="quantity-btn" onclick="this.getRootNode().host.handleQuantityChange(${
              item.id
            }, 'decrease')">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn" onclick="this.getRootNode().host.handleQuantityChange(${
              item.id
            }, 'increase')">+</button>
          </div>
          
          <button class="remove-btn" onclick="this.getRootNode().host.handleRemoveItem(${
            item.id
          })">Eliminar</button>
        </div>
      </div>
    `;
  }
}

customElements.define("cart-sidebar", CartSidebar);
