export default class NewsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch('./data/cards.json');
      const newsData = await response.json();
      this.render(newsData.articles);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  }

  render(articles = []) {
    this.shadowRoot.innerHTML = `
      <style>
:host {
  display: block;
  font-family: 'Inter', sans-serif;
  width: 78rem;
  margin: 0 auto;
}

h1 {
  font-size: 40px;
  font-weight: bold;
  margin-left: 1.5rem;
}

.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr)); 
}

.news-card {
  background: white;
  padding: 1.5625rem; 
  border-radius: 0.625rem; 
  display: flex;
  flex-direction: column;
}

.category {
  font-size: 0.8125rem; 
  color: #777;
}

.title {
  font-size: 1.1875rem;
  font-weight: bold;
  margin: 0.625rem 0;
}

.description {
  font-size: 0.875rem;
  color: #555;
  margin: 0.3125rem 0;
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

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.625rem; 
  font-size: 0.75rem;
  color: #777;

      </style>
      <h1>Latest</h1>
      <div class="news-container">
        ${articles
          .map(
            (article) => `
            
          <div class="news-card">
            <div class="category">${article.category || "Unknown"}</div>
            <div class="title">${article.title || "No title available"}</div>
            <div class="description">${
              article.description || "No description available"
            }</div>
            <div class="footer">
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
              <div class="date">${article.date || "Unknown date"}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}
