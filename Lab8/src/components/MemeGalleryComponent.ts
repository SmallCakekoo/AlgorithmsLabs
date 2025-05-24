import { Meme, getMemes } from "../services/Supabase/StorageService";
import "./MemeCardComponent";
import MemeCardComponent from "./MemeCardComponent";

class MemeGalleryComponent extends HTMLElement {
  private memes: Meme[] = [];
  private errorMessage: string = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      await this.loadMemes();
      this.render();
    } catch (error) {
      console.error("Error al cargar los memes:", error);
      this.errorMessage =
        'Error al cargar los memes. Por favor, verifica que el bucket "imagespractice" exista en Supabase.';
      this.render();
    }
  }

  private async loadMemes() {
    try {
      this.memes = await getMemes();
    } catch (error) {
      console.error("Error al cargar los memes:", error);
      throw error;
    }
  }

  // Método público para añadir un nuevo meme a la galería
  public addMeme(meme: Meme) {
    this.memes.unshift(meme);
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :host {
          display: block;
          font-family: 'Poppins', sans-serif;
          color: #f0f2f5;
        }
        
        .error-message {
          background-color: rgba(255, 87, 87, 0.2);
          border-left: 4px solid #ff5757;
          color: #ff5757;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0 4px 4px 0;
        }
        
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .no-memes-message {
          background: #3a3a4e;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          color: #bb86fc;
          font-size: 1.2rem;
          margin-top: 2rem;
        }
      </style>

      ${
        this.errorMessage
          ? `
        <div class="error-message">
          ${this.errorMessage}
        </div>
      `
          : ""
      }

      ${
        this.memes.length === 0
          ? `<div class="no-memes-message">No hay memes disponibles. ¡Sé el primero en subir uno!</div>`
          : `<div class="gallery" id="gallery-container"></div>`
      }
    `;

    // Si hay memes, crear y añadir los componentes de tarjeta de meme
    if (this.memes.length > 0) {
      const galleryContainer =
        this.shadowRoot.getElementById("gallery-container");
      if (galleryContainer) {
        this.memes.forEach((meme) => {
          const memeCard = document.createElement(
            "meme-card"
          ) as MemeCardComponent;
          memeCard.setMeme(meme);
          galleryContainer.appendChild(memeCard);
        });
      }
    }
  }
}

customElements.define("meme-gallery", MemeGalleryComponent);
export default MemeGalleryComponent;
