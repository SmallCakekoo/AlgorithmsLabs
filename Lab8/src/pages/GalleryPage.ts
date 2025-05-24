import "../components/UploadFormComponent";
import "../components/MemeGalleryComponent";
import { Meme } from "../services/Supabase/StorageService";
import MemeGalleryComponent from "../components/MemeGalleryComponent";

class GalleryPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Escuchar el evento personalizado cuando se sube un nuevo meme
    this.addEventListener("meme-uploaded", (e: Event) => {
      const customEvent = e as CustomEvent;
      const memes = customEvent.detail.memes as Meme[];
      const gallery = this.shadowRoot!.querySelector(
        "meme-gallery"
      ) as MemeGalleryComponent;
      if (gallery) {
        memes.forEach((meme) => gallery.addMeme(meme));
      }
    });
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
          padding: 1rem;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        upload-form {
          margin-bottom: 2rem;
          display: block;
        }
      </style>
      
      <div class="container">
        <upload-form></upload-form>
        <meme-gallery></meme-gallery>
      </div>
    `;
  }
}

export default GalleryPage;
