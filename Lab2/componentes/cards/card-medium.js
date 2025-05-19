class CardMedium extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const response = await fetch("./data/news.json");
      const data = await response.json();
      const articles = data.articlescards;

      const index = parseInt(this.getAttribute("index"), 10) || 0;
      const article = articles[index];

      this.render(article);
    } catch (error) {
      console.error("Nuh uh, error del fetch:", error);
    }
  }

  render(article) {
    if (!article) {
      this.shadowRoot.innerHTML = `<p>Error: No hay data, pailas</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `
    <style>
      .card-medium {
        width: 390px; 
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        font-family: Century Gothic, sans-serif;
        display: flex;
        margin-left: 25;
        flex-direction: column;
      }

      .card-medium img {
        width: 100%; 
        height: 180px;
        object-fit: cover;
      }

      .card-content {
        padding: 15px;
      }

      .category {
        font-size: 12px;
        color: gray;
      }

      .title {
        font-size: 18px;
        font-weight: bold;
        margin: 5px 0;
      }

      .description {
        font-size: 14px;
        color: gray;
        padding-bottom: 15px;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #eee;
        padding: 15px;
      }

      .authors {
        display: flex;
        align-items: center;
      }

      .author {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }

      .author img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 5px;
      }

      .author span {
        font-size: 13px;
        color: gray;
      }

      .date {
        font-size: 12px;
        color: gray;
      }
    </style>

    <div class="card-medium">
      <img class="banner" src="${article.image}" alt="Imagen de la noticia" />
      <div class="card-content">
        <p class="category">${article.category}</p>
        <p class="title">${article.title}</p>
        <p class="description">${article.description}</p>
      </div>
      <div class="card-footer">
        <div class="authors">
          ${article.authors
            .map(
              (author) => `
            <div class="author">
              <img src="${author.avatar}" alt="${author.name}">
              <span>${author.name}</span>
            </div>
          `
            )
            .join("")}
        </div>
        <span class="date">${article.date}</span>
      </div>
    </div>
  `;
  }
}

export default CardMedium;
