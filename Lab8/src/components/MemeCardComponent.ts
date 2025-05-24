import { Meme } from "../services/Supabase/StorageService";

class MemeCardComponent extends HTMLElement {
  private meme: Meme | null = null;

  static get observedAttributes() {
    return ["meme-data"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "meme-data" && newValue !== oldValue) {
      try {
        this.meme = JSON.parse(newValue);
        this.render();
      } catch (error) {
        console.error("Error al parsear los datos del meme:", error);
      }
    }
  }

  // Método alternativo para establecer los datos del meme directamente
  public setMeme(meme: Meme) {
    this.meme = meme;
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    if (!this.meme) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
        </style>
        <div>No hay datos de meme disponibles</div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        
        :host {
          display: block;
          font-family: 'Poppins', sans-serif;
        }
        
        .meme-card {
          background: #3a3a4e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }
        
        .meme-card:hover {
          transform: scale(1.05);
          z-index: 10;
        }
        
        .image-container {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio por defecto */
          overflow: hidden;
          background: #2d2d3a;
        }
        
        .meme-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain; /* Muestra la imagen completa sin recortar */
          background: #2d2d3a;
        }
        
        .meme-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #2d2d3a;
        }
        
        .file-type-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(187, 134, 252, 0.8);
          color: #2d2d3a;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 10;
        }
        
        .image-error {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #ff5757;
          font-size: 0.9rem;
          text-align: center;
          padding: 1rem;
        }

        .sound-button {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(187, 134, 252, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
        }

        .meme-card:hover .sound-button {
          opacity: 1;
        }

        .sound-button:hover {
          background: rgba(187, 134, 252, 1);
          transform: scale(1.1);
        }

        .sound-button i {
          font-size: 1rem;
        }
      </style>

      <div class="meme-card">
        <div class="image-container">
          ${
            this.meme.type === "video"
              ? `<span class="file-type-indicator">VIDEO</span>
             <video src="${this.meme.url}" alt="${this.meme.name}" class="meme-video" autoplay muted loop></video>
             <button class="sound-button" title="Activar/Desactivar sonido">
               <i class="fa-solid fa-volume-mute"></i>
             </button>`
              : this.meme.type === "gif"
              ? `<span class="file-type-indicator">GIF</span>
             <img src="${this.meme.url}" alt="${this.meme.name}" class="meme-image">`
              : `<img src="${this.meme.url}" alt="${this.meme.name}" class="meme-image" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'image-error\\''>Error al cargar la imagen</div>'"`
          }
        </div>
      </div>
    `;
  }

  private setupEventListeners() {
    if (!this.shadowRoot) return;

    const video = this.shadowRoot.querySelector("video");
    const soundButton = this.shadowRoot.querySelector(".sound-button");

    if (video && soundButton) {
      soundButton.addEventListener("click", () => {
        video.muted = !video.muted;
        const icon = soundButton.querySelector("i");
        if (icon) {
          icon.className = video.muted
            ? "fas fa-volume-mute"
            : "fas fa-volume-up";
        }
      });
    }
  }
}

customElements.define("meme-card", MemeCardComponent);
export default MemeCardComponent;
