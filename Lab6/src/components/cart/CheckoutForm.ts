import { store, State } from "../../flux/Store";
import { CartActions, UIActions } from "../../flux/Actions";

class CheckoutForm extends HTMLElement {
  private state: State = store.getState();
  private isSubmitting: boolean = false;
  private isSuccess: boolean = false;
  private errorMessage: string | null = null;

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

    if (this.state.ui.isCheckoutOpen) {
      this.render();
    } else if (this.shadowRoot) {
      this.shadowRoot.innerHTML = "";
    }
  }

  private getCartTotal(): number {
    return this.state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private addEventListeners() {
    const form = this.shadowRoot?.querySelector("form");
    form?.addEventListener("submit", this.handleSubmit.bind(this));

    const cancelButton = this.shadowRoot?.querySelector(".cancel-btn");
    cancelButton?.addEventListener("click", (e) => {
      e.preventDefault();

      UIActions.toggleCheckout();
    });
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    if (this.isSubmitting) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;

    if (!name || !email || !address) {
      this.errorMessage = "Por favor, completa todos los campos";
      this.render();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.render();

    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
      this.render();

      setTimeout(() => {
        CartActions.clearCart();
        this.isSuccess = false;

        UIActions.toggleCheckout();
      }, 2000);
    }, 1500);
  }

  private getStyles() {
    return `
      :host {
        display: block;
        --primary-color: #4c7cff;
        --primary-color-dark: #3a5dbe;
        --primary-color-light: #e8f0ff;
        --accent-color: #ff6b6b;
        --success-color: #4CAF50;
        --text-color: #333;
        --text-light: #666;
        --border-radius: 8px;
        --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        --transition: all 0.3s ease;
      }
      
      .checkout-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        backdrop-filter: blur(3px);
      }
      
      .checkout-content {
        background: white;
        border-radius: var(--border-radius);
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: var(--box-shadow);
        animation: slideIn 0.3s ease-out;
        
       
        scrollbar-width: thin;
        scrollbar-color: var(--primary-color-light) transparent;
      }
      
     
      .checkout-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .checkout-content::-webkit-scrollbar-track {
        background: transparent;
        border-radius: var(--border-radius);
      }
      
      .checkout-content::-webkit-scrollbar-thumb {
        background-color: var(--primary-color-light);
        border-radius: 20px;
        border: 2px solid white;
      }
      
      .checkout-content::-webkit-scrollbar-thumb:hover {
        background-color: var(--primary-color);
      }
      
      @keyframes slideIn {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .checkout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #eee;
        background: var(--primary-color-light);
      }
      
      .checkout-title {
        margin: 0;
        font-size: 1.5rem;
        color: var(--primary-color);
        font-weight: 700;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-light);
        transition: var(--transition);
      }
      
      .close-btn:hover {
        color: var(--accent-color);
      }
      
      .checkout-body {
        padding: 1.5rem;
      }
      
      .order-summary {
        margin-bottom: 2rem;
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: var(--border-radius);
      }
      
      .summary-title {
        font-size: 1.2rem;
        margin: 0 0 1rem;
        color: var(--text-color);
        position: relative;
        padding-bottom: 0.5rem;
      }
      
      .summary-title:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50px;
        height: 3px;
        background: var(--primary-color);
        border-radius: 3px;
      }
      
      .order-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      
      .order-table th,
      .order-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      
      .order-table th {
        font-weight: 600;
        color: var(--text-light);
        text-transform: uppercase;
        font-size: 0.85rem;
      }
      
      .order-total {
        font-weight: bold;
        text-align: right;
        font-size: 1.2rem;
        margin-top: 1rem;
        color: var(--primary-color);
        padding-top: 1rem;
        border-top: 1px dashed #ddd;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-color);
      }
      
      input, textarea {
        width: 90%;
        padding: 0.85rem;
        border: 2px solid #eee;
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition);
        background: #f9f9f9;
      }
      
      input:focus, textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        background: white;
        box-shadow: 0 0 0 3px rgba(76, 124, 255, 0.1);
      }
      
      textarea {
        min-height: 100px;
        resize: vertical;
      }
      
      .btn-row {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
      
      .btn {
        flex: 1;
        padding: 0.85rem;
        border: none;
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
        transition: var(--transition);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .submit-btn {
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 8px rgba(76, 124, 255, 0.2);
      }
      
      .submit-btn:hover {
        background: var(--primary-color-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(76, 124, 255, 0.3);
      }
      
      .cancel-btn {
        background: #f3f3f3;
        color: var(--text-color);
      }
      
      .cancel-btn:hover {
        background: #e5e5e5;
      }
      
      .error-message {
        color: var(--accent-color);
        margin-bottom: 1.5rem;
        padding: 0.75rem;
        background: rgba(255, 107, 107, 0.1);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--accent-color);
        font-weight: 500;
      }
      
      .success-message {
        color: var(--success-color);
        margin: 2rem 0;
        padding: 2rem;
        background: rgba(76, 175, 80, 0.1);
        border-radius: var(--border-radius);
        text-align: center;
        border: 1px solid rgba(76, 175, 80, 0.2);
      }
      
      .success-message h3 {
        color: var(--success-color);
        margin-top: 0;
        font-size: 1.5rem;
      }
      
      .loading {
        text-align: center;
        padding: 3rem;
      }
      
      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color);
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1.5rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  }

  render() {
    if (!this.shadowRoot || !this.state.ui.isCheckoutOpen) return;

    const total = this.getCartTotal();

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="checkout-modal">
        <div class="checkout-content">
          <div class="checkout-header">
            <h2 class="checkout-title">Finalizar Compra</h2>
          </div>
          
          <div class="checkout-body">
            ${
              this.isSubmitting
                ? `
              <div class="loading">
                <div class="spinner"></div>
                <p>Procesando tu pedido...</p>
              </div>
            `
                : this.isSuccess
                ? `
              <div class="success-message">
                <h3>¡Pedido realizado con éxito!</h3>
                <p>Gracias por tu compra. Hemos enviado un correo con los detalles de tu pedido.</p>
              </div>
            `
                : `
              <div class="order-summary">
                <h3 class="summary-title">Resumen del pedido</h3>
                
                <table class="order-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.state.cart
                      .map(
                        (item) => `
                      <tr>
                        <td>${item.title}</td>
                        <td>${item.quantity}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
                
                <div class="order-total">
                  Total: $${total.toFixed(2)}
                </div>
              </div>
              
              ${
                this.errorMessage
                  ? `
                <div class="error-message">
                  ${this.errorMessage}
                </div>
              `
                  : ""
              }
              
              <form>
                <div class="form-group">
                  <label for="name">Nombre completo</label>
                  <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                  <label for="email">Correo electrónico</label>
                  <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                  <label for="address">Dirección de envío</label>
                  <textarea id="address" name="address" required></textarea>
                </div>
                
                <div class="btn-row">
                  <button type="button" class="btn cancel-btn">Cancelar</button>
                  <button type="submit" class="btn submit-btn">Confirmar pedido</button>
                </div>
              </form>
            `
            }
          </div>
        </div>
      </div>
    `;

    this.addEventListeners();
  }
}

customElements.define("checkout-form", CheckoutForm);
