import { Agent } from "../types/api";
import { store } from "../flux/Store";
import { setMatchup } from "../flux/Actions";

export default class AgentCard extends HTMLElement {
  private agent: Agent | null = null;
  private selected: boolean = false;
  private selectable: boolean = true;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["selected", "selectable"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "selected") {
      this.selected = newValue !== null;
      this.render();
    } else if (name === "selectable") {
      this.selectable = newValue !== "false";
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  set agentData(agent: Agent) {
    this.agent = agent;
    this.render();
  }

  get agentData(): Agent | null {
    return this.agent;
  }

  private render() {
    if (!this.shadowRoot) return;

    if (!this.agent) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            height: 100%;
          }
          
          .agent-card {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #0F1923;
            border: 2px solid #1F2731;
            padding: 20px;
            text-align: center;
            height: 100%;
            color: white;
            font-family: 'Roboto', sans-serif;
            position: relative;
            overflow: hidden;
          }
          
          .agent-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 70, 85, 0.1) 0%, rgba(15, 25, 35, 0) 70%);
            pointer-events: none;
          }

          .loading-text {
            color: #FF4655;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            display: inline-block;
          }
          
          .loading-text::after {
            content: '...';
            position: absolute;
            animation: loadingDots 1.5s infinite;
          }
          
          @keyframes loadingDots {
            0% { content: '.'; }
            33% { content: '..'; }
            66% { content: '...'; }
          }
        </style>
        <div class="agent-card">
          <p class="loading-text">Cargando agente</p>
        </div>
      `;
      return;
    }

    const { displayName, displayIcon, role } = this.agent;

    const selectedClass = this.selected ? "selected" : "";
    const disabledClass = !this.selectable ? "disabled" : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .agent-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #0F1923, #192C3E);
          border: 2px solid ${this.selected ? "#FF4655" : "#1F2731"};
          padding: 16px;
          cursor: ${this.selectable ? "pointer" : "default"};
          transition: all 0.3s ease;
          height: 100%;
          box-sizing: border-box;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .agent-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255, 70, 85, 0.15) 0%, rgba(15, 25, 35, 0) 60%);
          opacity: ${this.selected ? 1 : 0.5};
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }
        
        .agent-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${
            this.selected ? "#FF4655" : "rgba(255, 70, 85, 0.3)"
          }, transparent);
          opacity: ${this.selected ? 1 : 0.5};
          transition: opacity 0.3s ease;
        }
        
        .agent-card.selected {
          box-shadow: 0 0 20px 2px rgba(255, 70, 85, 0.5);
          border-color: #FF4655;
          transform: translateY(-4px) scale(1.02);
        }
        
        .agent-card.disabled {
          opacity: 0.7;
          cursor: default;
        }
        
        .agent-card:not(.disabled):hover {
          box-shadow: 0 0 15px rgba(255, 70, 85, 0.4);
          border-color: #FF4655;
          transform: translateY(-4px);
        }

        .agent-card:not(.disabled):hover::after {
          opacity: 1;
        }
        
        .agent-image-container {
          position: relative;
          width: 40%;
          height: 100%;
          margin: 0;
          overflow: hidden;
          z-index: 2;
        }
        
        .agent-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3)) brightness(1.1) contrast(1.1);
          transition: transform 0.5s ease, filter 0.5s ease;
          z-index: 2;
        }
        
        .agent-card:hover .agent-image {
          transform: scale(1.05);
          filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4)) brightness(1.15) contrast(1.15);
        }
        
        .agent-info {
          width: 55%;
          text-align: center;
          position: relative;
          z-index: 2;
          padding: 10px;
        }
        
        .agent-name {
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 4px 0;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          padding-bottom: 8px;
          font-family: 'Valorant', 'Roboto', sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .agent-name::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background-color: #FF4655;
        }
        
        .agent-role {
          font-size: 14px;
          margin: 8px 0 0;
          color: #8F98A0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }
        
        .role-icon {
          width: 18px;
          height: 18px;
          filter: brightness(0) saturate(100%) invert(42%) sepia(95%) saturate(1352%) hue-rotate(314deg) brightness(119%) contrast(119%);
        }
        
        .vignette {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(15, 25, 35, 0.4) 100%);
          pointer-events: none;
          z-index: 3;
          opacity: 0.7;
        }
        
        @media (max-width: 768px) {
          .agent-name {
            font-size: 20px;
          }
          
          .agent-role {
            font-size: 12px;
          }
        }
      </style>
      <div class="agent-card ${selectedClass} ${disabledClass}">
        <div class="agent-image-container">
          <img class="agent-image" src="${displayIcon}" alt="${displayName}">
        </div>
        <div class="agent-info">
          <h3 class="agent-name">${displayName}</h3>
          ${
            role
              ? `
            <p class="agent-role">
              <img class="role-icon" src="${role.displayIcon}" alt="${role.displayName}">
              ${role.displayName}
            </p>
          `
              : ""
          }
        </div>
        <div class="vignette"></div>
      </div>
    `;

    if (this.selectable) {
      this.shadowRoot
        .querySelector(".agent-card")
        ?.addEventListener("click", () => {
          if (this.agent) {
            // Obtener el estado actual
            const state = store.getState();

            // Verificar si ya hay un agente seleccionado para el primer slot
            if (state.tournament.rounds.length > 0) {
              const currentRound = state.tournament.currentRound;
              const currentMatch = state.tournament.currentMatch;
              const matchData =
                state.tournament.rounds[currentRound].matches[currentMatch];

              // Si hay un matchup actual y el primer agente ya está seleccionado, establecer el segundo
              if (matchData && matchData.agent1 && !matchData.agent2) {
                store.dispatch(setMatchup(matchData.agent1, this.agent));
              } else {
                // Si no hay matchup o está vacío, establecer el primer agente
                store.dispatch(
                  setMatchup(this.agent, null as unknown as Agent)
                );
              }
            }
          }
        });
    }
  }
}
