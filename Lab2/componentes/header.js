class MainHeader extends HTMLElement {
  constructor() {
    super();
    console.log("Componente creado");
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `

<style>
.container {
  font-family: helvetica, arial, sans-serif;
  max-width: 75rem;
  margin: 0 auto;
}

h1 {
  font-size: 40px;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  color: gray;
  margin-top: 5px;
  font-size: 14px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}

.nav ul li {
  display: inline;
}

.nav ul button {
  background: none;
  border: none;
  color: gray;
  font-size: 14px;
  cursor: pointer;
  border-radius: 20px;
  padding: 8px;
  font-family: helvetica, arial, sans-serif;
  transition: background 0.3s ease;
}

.nav ul button:hover {
  background: #d6d6d6;
  border-radius: 20px;
  color: black;
}

.nav ul .active {
  background: #e0e0e0;
  border-radius: 20px;
  color: rgb(78, 78, 78);
  font-weight: bold;
}

</style>

       <header class="blog-header">
        <div class="container">
            <h1>Blog</h1>
            <p class="subtitle">Stay in the loop with the latest about our products</p>

            <nav class="nav">
                <ul>
                    <li><button class="active">All categories</button></li>
                    <li><button>Company</button></li>
                    <li><button>Product</button></li>
                    <li><button>Design</button></li>
                    <li><button>Engineering</button></li>
                    <search-bar></search-bar>
                </ul>

            </nav>
        </div>
    </header>
      `;
  }

  connectedCallback() {
    console.log("Componente conectado");
  }
}

export default MainHeader;
