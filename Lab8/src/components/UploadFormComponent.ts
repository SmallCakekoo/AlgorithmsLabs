import { uploadMeme, Meme } from "../services/Supabase/StorageService";

class UploadFormComponent extends HTMLElement {
  private errorMessage: string = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private setupEventListeners() {
    const form =
      this.shadowRoot!.querySelector<HTMLFormElement>("#upload-form");
    const fileInput = this.shadowRoot!.querySelector<HTMLInputElement>("#meme");
    const previewContainer =
      this.shadowRoot!.querySelector<HTMLDivElement>(".preview-container");

    // Evento para mostrar la previsualización cuando se seleccionan archivos
    fileInput?.addEventListener("change", (e) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.showPreviews(Array.from(input.files), previewContainer!);
      }
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const files = formData.getAll("meme") as File[];

      if (files.length > 0) {
        try {
          const uploadPromises = files.map((file) => uploadMeme(file));
          const newMemes = await Promise.all(uploadPromises);

          // Filtrar los memes que se subieron correctamente
          const successfulMemes = newMemes.filter(
            (meme) => meme !== null
          ) as Meme[];

          if (successfulMemes.length > 0) {
            // Disparar evento personalizado con los nuevos memes
            const event = new CustomEvent("meme-uploaded", {
              detail: { memes: successfulMemes },
              bubbles: true,
              composed: true,
            });
            this.dispatchEvent(event);

            this.errorMessage = "";
            form.reset();
            // Limpiar la previsualización después de subir
            if (previewContainer) {
              previewContainer.innerHTML = "";
            }
            this.render();
          }
        } catch (error) {
          console.error("Error al subir los memes:", error);
          this.errorMessage =
            "Error al subir los memes. Por favor, intenta de nuevo.";
          this.render();
        }
      }
    });
  }

  private showPreviews(files: File[], container: HTMLElement) {
    // Limpiar previsualización anterior
    container.innerHTML = "";

    files.forEach((file) => {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";

      // Crear elemento de previsualización según el tipo de archivo
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.className = "preview-media";
        img.onload = () => URL.revokeObjectURL(img.src); // Liberar memoria
        previewItem.appendChild(img);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.className = "preview-media";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.onloadedmetadata = () => URL.revokeObjectURL(video.src); // Liberar memoria
        previewItem.appendChild(video);
      }

      // Añadir botón para eliminar la previsualización
      const removeButton = document.createElement("button");
      removeButton.className = "preview-remove";
      removeButton.innerHTML = "×";
      removeButton.onclick = (e) => {
        e.preventDefault();
        previewItem.remove();
      };
      previewItem.appendChild(removeButton);

      container.appendChild(previewItem);
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
        }
        
        h2 {
          color: #bb86fc;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }
        
        .error-message {
          background-color: rgba(255, 87, 87, 0.2);
          border-left: 4px solid #ff5757;
          color: #ff5757;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0 4px 4px 0;
        }
        
        .upload-section {
          background: #3a3a4e;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .upload-form {
          display: flex;
          flex-direction: column;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #e0e0e0;
        }
        
        input[type="file"] {
          background: #2d2d3a;
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #4a4a5e;
          color: #e0e0e0;
          width: 100%;
          cursor: pointer;
        }
        
        input[type="file"]:hover {
          border-color: #bb86fc;
        }
        
        button {
          background: #bb86fc;
          color: #2d2d3a;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: flex-start;
        }
        
        button:hover {
          background: #a370db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(187, 134, 252, 0.3);
        }
        
        .preview-container {
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .preview-item {
          background: #2d2d3a;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 1;
        }
        
        .preview-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .preview-remove {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(255, 87, 87, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .preview-item:hover .preview-remove {
          opacity: 1;
        }
        
        .preview-remove:hover {
          background: rgba(255, 87, 87, 1);
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
      
      <div class="upload-section">
        <h2>Subir nuevos memes</h2>
        <form id="upload-form" class="upload-form">
          <div class="form-group">
            <label for="meme">Selecciona imágenes o videos (múltiples)</label>
            <input type="file" id="meme" name="meme" accept="image/*,video/*" multiple required>
          </div>
          <div class="preview-container"></div>
          <button type="submit">Subir memes</button>
        </form>
      </div>
    `;

    this.setupEventListeners();
  }
}

customElements.define("upload-form", UploadFormComponent);
export default UploadFormComponent;
