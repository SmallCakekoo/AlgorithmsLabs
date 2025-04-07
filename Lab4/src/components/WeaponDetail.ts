import { TransformedWeapon } from "../adapters/WeaponAdapter";
import { formatCategory } from "../common/utils";

export class WeaponDetail extends HTMLElement {
  private weapon!: TransformedWeapon;
  private closeButton!: HTMLButtonElement;
  private modal!: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // this is to pass a weapon to the component
  setWeapon(weapon: TransformedWeapon) {
    this.weapon = weapon;
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(15, 25, 35, 0.95);
                    z-index: 1000;
                    backdrop-filter: blur(10px);
                }

                .modal.active {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                }

                .modal-content {
                    background: linear-gradient(135deg, rgba(15, 25, 35, 0.95) 0%, rgba(22, 41, 55, 0.95) 100%);
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 800px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid #1f4160;
                }

                .modal-content::-webkit-scrollbar {
                    width: 8px;
                }

                .modal-content::-webkit-scrollbar-track {
                    background: rgba(15, 25, 35, 0.5);
                    border-radius: 4px;
                }

                .modal-content::-webkit-scrollbar-thumb {
                    background: #ff4655;
                    border-radius: 4px;
                }

                .close-button {
                    position: absolute;
                    top: 2rem;
                    right: 2rem;
                    background: none;
                    border: none;
                    color: #ece8e1;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0.5rem;
                    line-height: 1;
                    z-index: 2;
                }

                .close-button:hover {
                    transform: scale(1.1);
                    color: #ff4655;
                }

                .weapon-header {
                    display: flex;
                    align-items: center;
                    gap: 4rem;
                    margin-bottom: 3rem;
                    position: relative;
                }

                .weapon-header::after {
                    content: '';
                    position: absolute;
                    bottom: -1.5rem;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #1f4160, transparent);
                }

                .weapon-image-container {
                    width: 250px;
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(15, 25, 35, 0.5);
                    border-radius: 4px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    position: relative;
                    overflow: hidden;
                }

                .weapon-image-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, transparent 100%);
                    z-index: 1;
                }

                .weapon-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                    position: relative;
                    z-index: 2;
                }

                .weapon-info {
                    flex: 1;
                }

                .weapon-name {
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin: 0 0 0.8rem 0;
                    color: #ece8e1;
                    letter-spacing: 0.05em;
                    font-family: "Tungsten", sans-serif;
                    text-transform: uppercase;
                    line-height: 1;
                }

                .weapon-type {
                    font-size: 1.2rem;
                    color: #768079;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: "DINNext", sans-serif;
                }

                .weapon-price {
                    font-size: 1.4rem;
                    color: #ff4655;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    font-family: "DINNext", sans-serif;
                }

                .weapon-price::before {
                    content: '•';
                    color: #ff4655;
                }

                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-item {
                    background: rgba(15, 25, 35, 0.5);
                    padding: 1.5rem;
                    border-radius: 4px;
                    text-align: center;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(31, 65, 96, 0.5);
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                    border-color: #ff4655;
                    background: rgba(255, 70, 85, 0.1);
                }

                .stat-label {
                    font-size: 1rem;
                    color: #768079;
                    margin-bottom: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: "DINNext", sans-serif;
                }

                .stat-value {
                    font-size: 2rem;
                    color: #ece8e1;
                    font-weight: 600;
                    font-family: "Tungsten", sans-serif;
                }

                .skins-section {
                    margin-top: 4rem;
                    position: relative;
                }

                .skins-section::before {
                    content: '';
                    position: absolute;
                    top: -2rem;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #1f4160, transparent);
                }

                .skins-title {
                    font-size: 2.5rem;
                    color: #ece8e1;
                    margin-bottom: 2rem;
                    font-weight: 600;
                    font-family: "Tungsten", sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .skins-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1.5rem;
                }

                .skin-card {
                    background: rgba(15, 25, 35, 0.5);
                    border-radius: 4px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(31, 65, 96, 0.5);
                }

                .skin-card:hover {
                    transform: translateY(-5px);
                    border-color: #ff4655;
                    background: rgba(255, 70, 85, 0.1);
                }

                .skin-image-container {
                    width: 100%;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(15, 25, 35, 0.3);
                    overflow: hidden;
                    position: relative;
                }

                .skin-image-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, transparent 100%);
                    z-index: 1;
                }

                .skin-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                    position: relative;
                    z-index: 2;
                }

                .skin-name {
                    padding: 1.2rem;
                    text-align: center;
                    color: #ece8e1;
                    font-size: 1.1rem;
                    font-weight: 500;
                    font-family: "DINNext", sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (max-width: 600px) {
                    .modal-content {
                        padding: 1.5rem;
                    }

                    .weapon-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 2rem;
                    }

                    .weapon-image-container {
                        width: 100%;
                        height: 180px;
                    }

                    .weapon-name {
                        font-size: 2rem;
                    }

                    .stats-container {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .skins-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }
                }

                @media (min-width: 601px) and (max-width: 900px) {
                    .modal-content {
                        padding: 2rem;
                    }

                    .weapon-header {
                        gap: 3rem;
                    }

                    .weapon-image-container {
                        width: 200px;
                        height: 150px;
                    }

                    .stats-container {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1.5rem;
                    }

                    .skins-grid {
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    }
                }
            </style>
            <div class="modal">
                <div class="modal-content">
                    <button class="close-button">&times;</button>
                    <div class="weapon-header">
                        <div class="weapon-image-container">
                            <img class="weapon-image" src="${
                              this.weapon.displayIcon
                            }" alt="${this.weapon.displayName}">
                        </div>
                        <div class="weapon-info">
                            <h2 class="weapon-name">${
                              this.weapon.displayName
                            }</h2>
                            <p class="weapon-type">${formatCategory(
                              this.weapon.category
                            )}</p>
                            <p class="weapon-price">${this.weapon.price}</p>
                            <div class="stats-container">
                                <div class="stat-item">
                                    <div class="stat-label">Damage</div>
                                    <div class="stat-value">${
                                      this.weapon.damage
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Cadence</div>
                                    <div class="stat-value">${
                                      this.weapon.fireRate
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Charger</div>
                                    <div class="stat-value">${
                                      this.weapon.magazineSize
                                    }</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-label">Recharge</div>
                                    <div class="stat-value">${
                                      this.weapon.reloadTime
                                    }</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="skins-section">
                        <h3 class="skins-title">Available Skins</h3>
                        <div class="skins-grid">
                            ${this.weapon.skins
                              .map(
                                (skin) => `
                                <div class="skin-card">
                                    <div class="skin-image-container">
                                        <img class="skin-image" src="${
                                          skin.displayIcon ||
                                          this.weapon.displayIcon
                                        }" alt="${skin.displayName}">
                                    </div>
                                    <div class="skin-name">${
                                      skin.displayName
                                    }</div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        `;

    // this is to get the modal and close button
    this.modal = this.shadowRoot.querySelector(".modal") as HTMLDivElement;
    this.closeButton = this.shadowRoot.querySelector(
      ".close-button"
    ) as HTMLButtonElement;

    this.modal.classList.add("active");

    // this is to close the modal
    this.closeButton.addEventListener("click", () => this.closeModal());

    // this is to close the modal when the user clicks outside the modal
    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });

    // this is to close the modal when the user presses the escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeModal();
      }
    });
  }

  // this is to close the modal
  private closeModal() {
    this.modal.classList.remove("active");
    setTimeout(() => {
      this.remove();
    }, 300);
  }
}
