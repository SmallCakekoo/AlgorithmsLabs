import { TransformedWeapon } from "../adapters/WeaponAdapter";
import { WeaponDetail } from "./WeaponDetail";
import { formatCategory } from "../common/utils";

export class WeaponCard extends HTMLElement {
  private weapon!: TransformedWeapon;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // this is to pass a weapon to the component
  setWeapon(weapon: TransformedWeapon) {
    this.weapon = weapon;
    this.render();
  }

  // render the card
  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: linear-gradient(135deg, rgba(15, 25, 35, 0.95) 0%, rgba(22, 41, 55, 0.95) 100%);
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid #1f4160;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }

                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(to right, transparent, #ff4655, transparent);
                    transform: scaleX(0);
                    transition: transform 0.3s ease;
                }

                .card:hover::before {
                    transform: scaleX(1);
                }

                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 32px rgba(255, 70, 85, 0.15);
                    border-color: #ff4655;
                }

                .image-container {
                    width: 88%;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(15, 25, 35, 0.5);
                    border-radius: 4px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    overflow: hidden;
                    position: relative;
                }

                .image-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .card:hover .image-container::after {
                    opacity: 1;
                }

                .weapon-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                }

                .card:hover .weapon-image {
                    transform: scale(1.05) rotate(-1deg);
                }

                .weapon-name {
                    color: #ece8e1;
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    letter-spacing: 0.05em;
                    font-family: "Tungsten", sans-serif;
                    text-transform: uppercase;
                }

                .weapon-type {
                    color: #768079;
                    font-size: 1rem;
                    margin: 0 0 1.5rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: "DINNext", sans-serif;
                }

                .weapon-price {
                    color: #ff4655;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0 0 2rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-family: "DINNext", sans-serif;
                }

                .weapon-price::before {
                    content: '•';
                    color: #ff4655;
                }

                .weapon-stats {
                    margin-top: auto;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    font-size: 0.9rem;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(15, 25, 35, 0.5);
                    padding: 1rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(31, 65, 96, 0.5);
                }

                .stat-item:hover {
                    transform: translateY(-3px);
                    border-color: #ff4655;
                    background: rgba(255, 70, 85, 0.1);
                }

                .stat-label {
                    color: #768079;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    letter-spacing: 0.1em;
                    font-family: "DINNext", sans-serif;
                }

                .stat-value {
                    color: #ece8e1;
                    font-weight: 600;
                    font-size: 1.2rem;
                    font-family: "Tungsten", sans-serif;
                }
            </style>
            <div class="card">
                <div class="image-container">
                    <img class="weapon-image" src="${
                      this.weapon.displayIcon
                    }" alt="${this.weapon.displayName}">
                </div>
                <h3 class="weapon-name">${this.weapon.displayName}</h3>
                <p class="weapon-type">${formatCategory(
                  this.weapon.category
                )}</p>
                <p class="weapon-price">${this.weapon.price}</p>
                <div class="weapon-stats">
                    <div class="stat-item">
                        <span class="stat-label">Damage</span>
                        <span class="stat-value">${this.weapon.damage}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cadence</span>
                        <span class="stat-value">${this.weapon.fireRate}</span>
                    </div>
                </div>
            </div>
        `;

    // this is to open the detail of the weapon in a popup
    this.addEventListener("click", () => {
      const detail = document.createElement("weapon-detail") as WeaponDetail;
      detail.setWeapon(this.weapon);
      document.body.appendChild(detail);
    });
  }
}
