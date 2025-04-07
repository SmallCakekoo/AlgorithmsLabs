export class NavigationBar extends HTMLElement {
  private searchInput!: HTMLInputElement;
  private typeFilter!: HTMLSelectElement;
  // trust me TS, i'll bring this to you later

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: linear-gradient(to right, rgba(15, 25, 35, 0.95), rgba(22, 41, 55, 0.95));
                    backdrop-filter: blur(10px);
                    padding: 1rem;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    border-bottom: 2px solid #ff4655;
                    width: 100%;
                    box-sizing: border-box;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    width: 100%;
                    box-sizing: border-box;
                }

                .custom-select {
                    position: relative;
                    min-width: 180px;
                    max-width: 100%;
                    box-sizing: border-box;
                }

                .type-filter {
                    width: 100%;
                    padding: 0.8rem 1.2rem;
                    padding-right: 2.5rem;
                    border-radius: 4px;
                    border: 1px solid #1f4160;
                    background: rgba(15, 25, 35, 0.8);
                    color: #ece8e1;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: "DINNext", sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    backdrop-filter: blur(10px);
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    box-sizing: border-box;
                }

                .arrow {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #768079;
                    pointer-events: none;
                }

                .type-filter:focus {
                    outline: none;
                    border-color: #ff4655;
                    box-shadow: 0 0 0 2px rgba(255, 70, 85, 0.2);
                    transform: translateY(-1px);
                }

                .search-container { 
                    flex: 1;
                    position: relative;
                    min-width: 0;
                    box-sizing: border-box;
                }

                .search-input {
                    width: 100%;
                    padding: 0.8rem 1.2rem;
                    padding-left: 3rem;
                    border-radius: 4px;
                    border: 1px solid #1f4160;
                    background: rgba(15, 25, 35, 0.8);
                    color: #ece8e1;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    font-family: "DINNext", sans-serif;
                    backdrop-filter: blur(10px);
                    box-sizing: border-box;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #ff4655;
                    box-shadow: 0 0 0 2px rgba(255, 70, 85, 0.2);
                    transform: translateY(-1px);
                }

                .search-input::placeholder {
                    color: #768079;
                    opacity: 0.8;
                }

                .search-container::before {
                    content: "🔍";
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #768079;
                    transition: all 0.3s ease;
                }

                @media (max-width: 600px) { 
                    .nav-container {
                        flex-direction: column;
                        gap: 1rem;
                        padding: 0;
                    }

                    .search-input,
                    .type-filter {
                        padding: 0.8rem 1rem;
                        width: 100%;
                    }

                    .custom-select {
                        width: 100%;
                    }

                    .search-container {
                        width: 100%;
                    }
                }

                @media (min-width: 601px) and (max-width: 900px) {
                    .nav-container {
                        padding: 0 1rem;
                    }

                    .custom-select {
                        min-width: 150px;
                        max-width: 200px;
                    }
                }

                @media (min-width: 901px) {
                    .nav-container {
                        padding: 0 2rem;
                    }
                }

                @media (max-width: 400px) {
                    .search-input::placeholder {
                        font-size: 0.9rem;
                    }

                    .type-filter {
                        font-size: 0.9rem;
                    }
                }
            </style>
            <div class="nav-container">
                <div class="custom-select">
                    <select class="type-filter">
                        <option value="">All types</option>
                        <option value="Heavy">Heavy</option>
                        <option value="Sidearm">Secondary Weapons</option>
                        <option value="Rifle">Rifles</option>
                        <option value="Sniper">Snipers</option>
                        <option value="Shotgun">Shotguns</option>
                        <option value="SMG">Submachine Guns</option>
                    </select>
                    <span class="arrow">▼</span>
                </div>
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search for weapons...">
                </div>
            </div>
        `;

    // this is the search input and type filter
    this.searchInput = this.shadowRoot.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    this.typeFilter = this.shadowRoot.querySelector(
      ".type-filter"
    ) as HTMLSelectElement;

    this.setupEventListeners();
  }

  // listen when you type or change and dispatch the event
  private setupEventListeners() {
    this.searchInput.addEventListener("input", () =>
      this.dispatchFilterEvent()
    );
    this.typeFilter.addEventListener("change", () =>
      this.dispatchFilterEvent()
    );
  }

  // this is the event that will be dispatched
  private dispatchFilterEvent() {
    const event = new CustomEvent("filter-change", {
      detail: {
        searchTerm: this.searchInput.value.toLowerCase(),
        typeFilter: this.typeFilter.value,
      },
    });
    this.dispatchEvent(event);
  }
}
