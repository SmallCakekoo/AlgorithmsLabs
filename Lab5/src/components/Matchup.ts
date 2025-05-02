import { Agent } from "../types/api";
import { VoteStatistics } from "../types/flux";
import { store } from "../flux/Store";
import { voteForAgent, advanceTournament } from "../flux/Actions";

export default class Matchup extends HTMLElement {
  private agent1: Agent | null = null;
  private agent2: Agent | null = null;
  private winner: string | null = null;
  private voteStats: VoteStatistics | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["winner"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "winner") {
      this.winner = newValue;
      this.render();
    }
  }

  connectedCallback() {
    // Suscribirse a cambios en el store
    this.unsubscribe = store.subscribe(() => {
      // Recalcular estadísticas cuando cambia el store
      if (this.agent1 && this.agent2) {
        this.calculateVoteStatistics();
        this.render();
      }
    });

    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  set matchup(data: { agent1: Agent; agent2: Agent; winner: string | null }) {
    this.agent1 = data.agent1;
    this.agent2 = data.agent2;
    this.winner = data.winner;
    this.calculateVoteStatistics();
    this.render();
  }

  private calculateVoteStatistics() {
    if (!this.agent1 || !this.agent2) return;

    const state = store.getState();
    const { agentVotes } = state.statistics;

    const agent1Votes = agentVotes[this.agent1.uuid] || 0;
    const agent2Votes = agentVotes[this.agent2.uuid] || 0;
    const totalMatchVotes = agent1Votes + agent2Votes;

    // Calcular porcentajes (evitando división por cero)
    const agent1Percentage =
      totalMatchVotes > 0
        ? Math.round((agent1Votes / totalMatchVotes) * 100)
        : 50;
    const agent2Percentage =
      totalMatchVotes > 0
        ? Math.round((agent2Votes / totalMatchVotes) * 100)
        : 50;

    this.voteStats = {
      agent1Votes,
      agent2Votes,
      agent1Percentage,
      agent2Percentage,
      totalVotes: totalMatchVotes,
    };
  }

  private renderVoteStatistics() {
    if (!this.voteStats) return "";

    return `
      <div class="vote-statistics">
        <div class="stats-container">
          <div class="stats-label">Estadísticas de votación</div>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress agent1-progress" style="width: ${
                this.voteStats.agent1Percentage
              }%"></div>
              <div class="progress agent2-progress" style="width: ${
                this.voteStats.agent2Percentage
              }%"></div>
            </div>
            <div class="percentage-labels">
              <span class="agent1-percent">${
                this.voteStats.agent1Percentage
              }%</span>
              <span class="agent2-percent">${
                this.voteStats.agent2Percentage
              }%</span>
            </div>
          </div>
          <div class="vote-counts">
            <span>${this.voteStats.agent1Votes} votos</span>
            <span>${this.voteStats.agent2Votes} votos</span>
          </div>
          <div class="total-votes">
            Total: ${this.voteStats.totalVotes} ${
      this.voteStats.totalVotes === 1 ? "voto" : "votos"
    }
          </div>
        </div>
      </div>
    `;
  }

  private render() {
    if (!this.shadowRoot) return;

    if (!this.agent1 || !this.agent2) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
          }
          
          .matchup-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px;
            text-align: center;
            background-color: #0F1923;
            clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
            border: 2px solid #1F2731;
            color: white;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          }
          
          .loading-text {
            color: #FF4655;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 18px;
            margin: 20px 0;
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
        <div class="matchup-container">
          <p class="loading-text">Cargando enfrentamiento</p>
        </div>
      `;
      return;
    }

    // Calcular estadísticas de votación si no existen
    if (!this.voteStats) {
      this.calculateVoteStatistics();
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 100%;
        }
        
        .matchup-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background-color: rgba(15, 25, 35, 0.95);
          padding: 20px;
          border: 2px solid #1F2731;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .matchup-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }
        
        .matchup-title {
          font-size: 36px;
          color: #FF4655;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: 4px;
          font-weight: 700;
          position: relative;
          display: inline-block;
          padding: 0 20px 15px;
          font-family: 'Valorant', 'Roboto', sans-serif;
        }
        
        .matchup-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FF4655, transparent);
        }
        
        .matchup-subtitle {
          font-size: 18px;
          color: #8F98A0;
          margin: 15px 0 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .matchup-agents {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          position: relative;
          flex-wrap: wrap;
        }
        
        .agent-container {
          flex: 1;
          max-width: 300px;
          position: relative;
          transition: all 0.5s ease;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .agent-container.loser {
          opacity: 0.6;
          transform: scale(0.9);
          filter: grayscale(40%);
        }
        
        .agent-container.winner {
          transform: scale(1.05);
        }
        
        .agent-container.winner::before {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 30px;
          height: 30px;
          background-color: #FF4655;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          z-index: 2;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        
        .agent-info {
          margin-top: 10px;
          text-align: center;
          width: 100%;
        }
        
        .vs-container {
          position: relative;
          margin: 0 20px;
          z-index: 3;
        }
        
        .vs {
          font-size: 24px;
          font-weight: bold;
          color: white;
          position: relative;
          background: #FF4655;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 20px rgba(255, 70, 85, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Valorant', 'Roboto', sans-serif;
        }
        
        .vs::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid #FF4655;
          border-radius: 50%;
          animation: ripple 1.5s linear infinite;
          opacity: 0;
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        
        .vs::after {
          content: '';
          position: absolute;
          width: 170%;
          height: 2px;
          background: #FF4655;
          z-index: -1;
          opacity: 0.3;
        }
        
        .vote-button {
          display: block;
          width: 100%;
          padding: 15px 0;
          margin-top: 20px;
          background-color: #1F2731;
          color: white;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: bold;
          transition: all 0.3s;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
          font-size: 16px;
        }
        
        .vote-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.5s;
        }
        
        .vote-button:hover::before {
          left: 100%;
        }
        
        .vote-button:hover {
          background-color: #FF4655;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(255, 70, 85, 0.4);
        }
        
        .vote-button.selected, .vote-button.winner {
          background-color: #FF4655;
          cursor: default;
        }
        
        .vote-button.loser {
          opacity: 0.6;
        }
        
        .vote-statistics {
          margin-top: 10px;
          background-color: #1F2731;
          padding: 25px;
        }
        
        .stats-container {
          width: 100%;
        }
        
        .stats-label {
          font-size: 20px;
          color: white;
          text-align: center;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 500;
        }
        
        .progress-container {
          margin-bottom: 20px;
        }
        
        .progress-bar {
          height: 40px;
          display: flex;
          overflow: hidden;
          background-color: #0F1923;
          position: relative;
        }
        
        .progress {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          transition: width 0.8s ease;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        
        .progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%);
          background-size: 15px 15px;
          animation: progressAnimation 1s linear infinite;
          opacity: 0.5;
        }
        
        @keyframes progressAnimation {
          0% { background-position: 0 0; }
          100% { background-position: 15px 0; }
        }
        
        .agent1-progress {
          background-color: #258FCC;
        }
        
        .agent2-progress {
          background-color: #FF4655;
        }
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-weight: bold;
          color: white;
          font-size: 18px;
        }
        
        .vote-counts {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          color: #8F98A0;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 1px;
        }
        
        .total-votes {
          text-align: center;
          margin-top: 20px;
          color: white;
          font-size: 16px;
          letter-spacing: 1px;
          font-weight: 500;
        }
        
        agent-card {
          width: 100%;
          height: 120px;
          filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3)) brightness(1.1);
        }
        
        /* Media queries para dispositivos más pequeños */
        @media (max-width: 768px) {
          .matchup-container {
            padding: 15px;
          }
          
          .matchup-title {
            font-size: 28px;
          }
          
          .matchup-agents {
            flex-direction: column;
            gap: 40px;
          }
          
          .vs-container {
            margin: 10px 0;
          }
          
          .vs::after {
            width: 100%;
            transform: rotate(90deg);
          }
          
          .agent-container {
            max-width: 260px;
          }
        }
        
        @media (max-width: 480px) {
          .matchup-title {
            font-size: 24px;
          }
          
          .vote-button {
            padding: 12px 0;
            font-size: 14px;
          }
          
          .agent-container {
            max-width: 220px;
          }
        }
      </style>
      
      <div class="matchup-container">
        <div class="matchup-header">
          <h2 class="matchup-title">Enfrentamiento</h2>
          <p class="matchup-subtitle">¡Vota por tu agente favorito!</p>
        </div>
        
        <div class="matchup-agents">
          <div class="agent-container ${
            this.winner === this.agent1.uuid ? "winner" : ""
          } ${this.winner && this.winner !== this.agent1.uuid ? "loser" : ""}">
            <agent-card id="agent1-card"></agent-card>
            <div class="agent-info">
              <button 
                class="vote-button ${
                  this.winner === this.agent1.uuid ? "winner" : ""
                } ${
      this.winner && this.winner !== this.agent1.uuid ? "loser" : ""
    }" 
                id="vote-agent1"
                ${this.winner ? "disabled" : ""}
              >
                Votar por ${this.agent1.displayName}
              </button>
            </div>
          </div>
          
          <div class="vs-container">
            <div class="vs">VS</div>
          </div>
          
          <div class="agent-container ${
            this.winner === this.agent2.uuid ? "winner" : ""
          } ${this.winner && this.winner !== this.agent2.uuid ? "loser" : ""}">
            <agent-card id="agent2-card"></agent-card>
            <div class="agent-info">
              <button 
                class="vote-button ${
                  this.winner === this.agent2.uuid ? "winner" : ""
                } ${
      this.winner && this.winner !== this.agent2.uuid ? "loser" : ""
    }" 
                id="vote-agent2"
                ${this.winner ? "disabled" : ""}
              >
                Votar por ${this.agent2.displayName}
              </button>
            </div>
          </div>
        </div>
        
        ${this.renderVoteStatistics()}
      </div>
    `;

    if (!this.winner) {
      const agent1Card = this.shadowRoot.getElementById(
        "agent1-card"
      ) as HTMLElement & { agentData: Agent };
      if (agent1Card) {
        agent1Card.agentData = this.agent1;
        agent1Card.setAttribute("selectable", "false");
      }

      const agent2Card = this.shadowRoot.getElementById(
        "agent2-card"
      ) as HTMLElement & { agentData: Agent };
      if (agent2Card) {
        agent2Card.agentData = this.agent2;
        agent2Card.setAttribute("selectable", "false");
      }

      // Agregar event listeners para los botones de votación
      this.shadowRoot
        .getElementById("vote-agent1")
        ?.addEventListener("click", () => {
          if (this.agent1?.uuid) {
            store.dispatch(voteForAgent(this.agent1.uuid));

            // Esperar un momento para que se vea el ganador antes de avanzar
            setTimeout(() => {
              store.dispatch(advanceTournament());
            }, 500);
          }
        });

      this.shadowRoot
        .getElementById("vote-agent2")
        ?.addEventListener("click", () => {
          if (this.agent2?.uuid) {
            store.dispatch(voteForAgent(this.agent2.uuid));

            // Esperar un momento para que se vea el ganador antes de avanzar
            setTimeout(() => {
              store.dispatch(advanceTournament());
            }, 500);
          }
        });
    } else {
      const agent1Card = this.shadowRoot.getElementById(
        "agent1-card"
      ) as HTMLElement & { agentData: Agent };
      if (agent1Card) {
        agent1Card.agentData = this.agent1;
        agent1Card.setAttribute("selectable", "false");
        if (this.winner === this.agent1.uuid) {
          agent1Card.setAttribute("selected", "");
        }
      }

      const agent2Card = this.shadowRoot.getElementById(
        "agent2-card"
      ) as HTMLElement & { agentData: Agent };
      if (agent2Card) {
        agent2Card.agentData = this.agent2;
        agent2Card.setAttribute("selectable", "false");
        if (this.winner === this.agent2.uuid) {
          agent2Card.setAttribute("selected", "");
        }
      }
    }
  }
}
