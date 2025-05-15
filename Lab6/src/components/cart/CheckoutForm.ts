import { store, State } from "../../flux/Store";
import { CartActions } from "../../flux/Actions";

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
    this.render();
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
      this.dispatchEvent(
        new CustomEvent("toggle-checkout", {
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    if (this.isSubmitting) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Validar formulario
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;

    if (!name || !email || !address) {
      this.errorMessage = "Por favor, completa todos los campos";
      this.render();
      return;
    }

    // Procesar pedido
    this.isSubmitting = true;
    this.errorMessage = null;
    this.render();

    // Simulamos una solicitud a un servidor
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
      this.render();

      // Limpiar carrito después de compra exitosa
      setTimeout(() => {
        CartActions.clearCart();
        this.isSuccess = false;
        this.dispatchEvent(
          new CustomEvent("toggle-checkout", {
            bubbles: true,
            composed: true,
          })
        );
      }, 2000);
    }, 1500);
  }

  private getStyles() {
    return `
      :host {
        display: block;
      }
      
      .checkout-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      
      .checkout-content {
        background: white;
        border-radius: 8px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }
      
      .checkout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }
      
      .checkout-title {s
        margin: 0;
        font-size: 1.5rem;
        color: var(--primary-color, #4c7cff);
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }
      
      .checkout-body {
        padding: 1.5rem;
      }
      
      .order-summary {
        margin-bottom: 2rem;
      }
      
      .summary-title {
        font-size: 1.2rem;
        margin: 0 0 1rem;
      }
      
      .order-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      
      .order-table th,
      .order-table td {
        padding: 0.5rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      
      .order-total {
        font-weight: bold;
        text-align: right;
        font-size: 1.1rem;
        margin-top: 1rem;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      input, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      
      textarea {
        min-height: 80px;
        resize: vertical;
      }
      
      .btn-row {
        display: flex;
        gap: 1rem;
      }
      
      .btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        font-size: 1rem;
      }
      
      .submit-btn {
        background: var(--primary-color, #4c7cff);
        color: white;
      }
      
      .cancel-btn {
        background: var(--secondary-color, #f3f3f3);
        color: var(--text-color, #333);
      }
      
      .error-message {
        color: var(--accent-color, #ff6b6b);
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 4px;
      }
      
      .success-message {
        color: #4CAF50;
        margin-bottom: 1rem;
        padding: 1rem;
        background: rgba(76, 175, 80, 0.1);
        border-radius: 4px;
        text-align: center;
      }
      
      .loading {
        text-align: center;
        padding: 2rem;
      }
      
      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid var(--primary-color, #4c7cff);
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  }

  render() {
    if (!this.shadowRoot) return;

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
