class CardLarge extends HTMLElement {
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
        .card-large {
          width: 590px; 
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          font-family: Century Gothic, sans-serif;
          margin: 5px;
          display: flex;
          flex-direction: column;
        }

        .card-large img.banner {
          width: 100%;
          height: 320px;
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
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #eee;
          padding: 20px 15px;
        }

        .authors {
          display: flex;
          align-items: center;
        }

        .author-avatars-names {
          display: flex;
          align-items: center;
          gap: 10px; 
        }

        .avatars {
          display: flex;
        }

        .avatars img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin-right: -7px;
          border: 3px solid white;
        }

        .names {
          font-size: 13px;
          color: gray;
          display: flex;
          gap: 5px;
        }

        .date {
          font-size: 12px;
          color: gray;
        }
      </style>

      <div class="card-large">
        <img class="banner" src="${article.image}" alt="Imagen de la noticia" />
        <div class="card-content">
          <p class="category">${article.category}</p>
          <p class="title">${article.title}</p>
          <p class="description">${article.description}</p>
        </div>
        <div class="card-footer">
          <div class="authors">
            <div class="author-avatars-names">
              <div class="avatars">
                ${article.authors
                  .map((author) => `<img src="${author.avatar}" alt="${author.name}">`)
                  .join("")}
              </div>
              <div class="names">
               ${article.authors.map((author) => author.name).join(" & ")}
              </div>
            </div>
          </div>
          <span class="date">${article.date}</span>
        </div>
      </div>
    `;
  }
}

export default CardLarge;
