class Root extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupRouter();
  }

  private setupRouter() {
    const content = this.shadowRoot!.querySelector("#content")!;

    const handleRoute = () => {
      content.innerHTML = `<gallery-page></gallery-page>`;
    };

    window.addEventListener("popstate", handleRoute);
    handleRoute();
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :host {
          display: block;
          min-height: 100vh;
          background: #2d2d3a;
          font-family: 'Poppins', sans-serif;
          color: #f0f2f5;
        }

        #content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
      </style>

      <div id="content"></div>
    `;
  }
}

export default Root;
