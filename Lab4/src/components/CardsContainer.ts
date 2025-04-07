import { WeaponAdapter } from "../adapters/WeaponAdapter";
import { TransformedWeapon } from "../adapters/WeaponAdapter";
import getWeaponsFromValorantAPI from "../services/ValorantService";

export class CardsContainer extends HTMLElement {
  // i'm gonna use private bc i'm using typescript and i don't want to use public.
  // after importing, i save what i show and what i filter.
  private weapons: TransformedWeapon[] = [];
  private filteredWeapons: TransformedWeapon[] = [];
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      this.showLoading(); // show loading, duh.
      const data = await getWeaponsFromValorantAPI();
      this.weapons = WeaponAdapter.transformWeapons(data.data);
      this.filteredWeapons = [...this.weapons];
      this.render();
      this.setupFilterListeners();
    } catch (error) {
      this.showError("Error al cargar las armas");
      console.error("Error:", error);
    }
  }
  // to listen the filter change
  private setupFilterListeners() {
    const navigationBar = document.querySelector("navigation-bar");
    if (navigationBar) {
      navigationBar.addEventListener("filter-change", (event: Event) => {
        const customEvent = event as CustomEvent<{
          searchTerm: string;
          typeFilter: string;
        }>;
        this.filterWeapons(
          customEvent.detail.searchTerm,
          customEvent.detail.typeFilter
        );
      });
    }
  }

  // to filter the weapons
  private filterWeapons(searchTerm: string, typeFilter: string) {
    this.filteredWeapons = this.weapons.filter((weapon) => {
      const matchesSearch = weapon.displayName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "all" || weapon.category.includes(typeFilter);
      return matchesSearch && matchesType;
    });
    this.render();
  }

  private showLoading() {
    this.shadow.innerHTML = `
      <style>
        .loading {
          grid-column: 1 / -1;  //Se salta todas las columnas y se expande completamente
          text-align: center;
          padding: 4rem 2rem;
          color: #ece8e1;
          font-family: "DINNext", sans-serif;
          font-size: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
      </style>
      <div class="loading">Loading all weapons...</div>
    `;
  }

  private showError(message: string) {
    this.shadow.innerHTML = `
      <style>
        .error {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #ff4655;
          font-family: "DINNext", sans-serif;
          font-size: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
      </style>
      <div class="error">${message}</div>
    `;
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          padding: 2rem;
          margin: 0 auto;
          max-width: 1400px;
          position: relative;
        }

        .container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(to right, transparent, #1f4160, transparent);
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          color: #ece8e1;
          padding: 4rem 2rem;
          font-family: "DINNext", sans-serif;
          font-size: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        weapon-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          height: 100%;
        }

        weapon-card img {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        @media (max-width: 600px) {
          .container {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 1.5rem;
          }
        }

        @media (min-width: 601px) and (max-width: 900px) {
          .container {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            padding: 1.5rem;
          }
        }
      </style>
      <div class="container">
        ${
          this.filteredWeapons.length > 0
            ? this.filteredWeapons
                .map(
                  () => `
                <weapon-card></weapon-card>
            `
                )
                .join("")
            : '<div class="no-results">No se encontraron armas</div>'
        }
      </div>
    `;
    // each card with their filter
    const cards = this.shadow.querySelectorAll("weapon-card");
    cards.forEach((card, index) => {
      (
        card as HTMLElement & { setWeapon: (weapon: TransformedWeapon) => void }
      ).setWeapon(this.filteredWeapons[index]);
    });
  }
}

export default CardsContainer;
