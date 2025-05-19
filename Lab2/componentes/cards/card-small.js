class CardSmall extends HTMLElement {
  constructor() {
    super();
    console.log("Componente creado");
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
        .card-small {
          width: 380px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          font-family: Century Gothic, sans-serif;
          margin: 0px 20px 0px 20px;
          display: flex;
          flex-direction: column;
        }

        .card-content {
        padding: 10px;
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
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eee;
          padding: 10px 15px;
        }

        .authors {
          display: flex;
          align-items: center;
          gap: 5px;
          justify-content: center;
        }

        .authors img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: -7px;
          border: 3px solid white;
        }

        .author-names {
          font-size: 13px;
          color: gray;
          padding-left: 5px;
        }
  
        .date {
          font-size: 12px;
          color: gray;
        }

      </style>

      <div class="card-small">
        <div class="card-content">
          <p class="category">${article.category}</p>
          <p class="title">${article.title}</p>
          <p class="description">${article.description}</p>
        </div>
        <div class="card-footer">
          <div class="authors">
            <div class="author-images">
              ${article.authors
                .map(
                  (author) =>
                    `<img src="${author.avatar}" alt="${author.name}">`
                )
                .join("")}
            </div>
            <div class="author-names">
              ${article.authors.map((author) => author.name).join(" & ")}
            </div>
          </div>
          <span class="date">${article.date}</span>
        </div>
      </div>
    `;
  }
}

export default CardSmall;
