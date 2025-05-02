import { store } from "../flux/Store";
import {
  voteForAgent,
  advanceTournament,
  initializeTournament,
  setMatchup,
} from "../flux/Actions";
import { getAgents } from "../services/valorant-api";
import { Agent } from "../types/api";

export default class TournamentApp extends HTMLElement {
  private unsubscribe: (() => void) | null = null;
  private loadingError: string | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // Escuchar cambios en el store
    this.unsubscribe = store.subscribe(() => {
      this.render();
    });

    // Inicializar el torneo al cargar
    try {
      const agents = await getAgents();

      if (agents.length < 2) {
        this.loadingError =
          "No hay suficientes agentes jugables para iniciar un torneo.";
        this.render();
        return;
      }

      initializeTournament(agents);
    } catch (error) {
      console.error("Error al cargar los agentes:", error);
      this.loadingError =
        "Error al cargar los agentes. Por favor, intenta recargar la página.";
      this.render();
    }

    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private handleVote(event: CustomEvent) {
    const agentUuid = event.detail.agentUuid;
    store.dispatch(voteForAgent(agentUuid));

    // Esperar un momento para que se vea el ganador antes de avanzar
    setTimeout(() => {
      store.dispatch(advanceTournament());
    }, 1500);
  }

  private handleReset() {
    this.loadingError = null;
    // Usamos el estado actual para reiniciar pero preservando datos

    getAgents()
      .then((agents: Agent[]) => {
        if (agents.length < 2) {
          this.loadingError =
            "No hay suficientes agentes jugables para iniciar un torneo.";
          this.render();
          return;
        }

        // Usar el método de Store que preserva los datos históricos
        // en lugar de inicializar todo desde cero
        store.clearStorage();
        initializeTournament(agents);
      })
      .catch((error: Error) => {
        console.error("Error al reiniciar el torneo:", error);
        this.loadingError =
          "Error al cargar los agentes. Por favor, intenta recargar la página.";
        this.render();
      });
  }

  private renderCurrentMatch() {
    const state = store.getState();
    const { tournament } = state;

    if (tournament.rounds.length === 0 || tournament.isComplete) {
      return "";
    }

    const currentRound = tournament.rounds[tournament.currentRound];

    return `
      <div class="current-match-container">
        <h3 class="round-name">${currentRound.name} - Enfrentamiento ${
      tournament.currentMatch + 1
    }/${currentRound.matches.length}</h3>
        <matchup-element id="current-matchup"></matchup-element>
      </div>
    `;
  }

  private renderTournamentBracket() {
    const state = store.getState();
    const { tournament } = state;

    if (tournament.rounds.length === 0) {
      return "<p class='loading-text'>Cargando torneo...</p>";
    }

    return `
      <div class="tournament-bracket">
        <h3 class="bracket-title">TABLA DEL TORNEO</h3>
        <div class="rounds-container">
          ${tournament.rounds
            .map(
              (round, roundIndex) => `
            <div class="round">
              <h4 class="round-name">${round.name}</h4>
              <div class="matches">
                ${round.matches
                  .map(
                    (match, matchIndex) => `
                  <div class="bracket-match ${
                    roundIndex === tournament.currentRound &&
                    matchIndex === tournament.currentMatch
                      ? "current"
                      : ""
                  } ${match.winner ? "completed" : ""}">
                    <div class="bracket-agent ${
                      match.winner === match.agent1?.uuid ? "winner" : ""
                    } ${!match.agent1 ? "empty" : ""}">
                      ${
                        match.agent1
                          ? `
                          <div class="agent-content">
                            ${
                              match.agent1.displayIcon
                                ? `<div class="agent-icon-wrapper"><img class="agent-icon" src="${match.agent1.displayIcon}" alt="${match.agent1.displayName}"></div>`
                                : ""
                            }
                            <span>${match.agent1.displayName}</span>
                          </div>
                          ${
                            match.winner === match.agent1.uuid
                              ? '<div class="winner-mark"><span>✓</span></div>'
                              : ""
                          }
                          `
                          : "?"
                      }
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="bracket-agent ${
                      match.winner === match.agent2?.uuid ? "winner" : ""
                    } ${!match.agent2 ? "empty" : ""}">
                      ${
                        match.agent2
                          ? `
                          <div class="agent-content">
                            ${
                              match.agent2.displayIcon
                                ? `<div class="agent-icon-wrapper"><img class="agent-icon" src="${match.agent2.displayIcon}" alt="${match.agent2.displayName}"></div>`
                                : ""
                            }
                            <span>${match.agent2.displayName}</span>
                          </div>
                          ${
                            match.winner === match.agent2.uuid
                              ? '<div class="winner-mark"><span>✓</span></div>'
                              : ""
                          }
                          `
                          : "?"
                      }
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  private renderSidebar() {
    return `
      <div class="sidebar-container">
        <voting-statistics></voting-statistics>
      </div>
    `;
  }

  private renderTournamentLayout() {
    const state = store.getState();
    const { tournament } = state;

    if (tournament.isComplete) {
      return this.renderWinner();
    }

    return `
      <div class="tournament-layout">
        <div class="main-row">
          <div class="main-content">
            ${this.renderCurrentMatch()}
          </div>
          ${this.renderSidebar()}
        </div>
        <div class="bracket-row">
          <div class="bracket-container">
            ${this.renderTournamentBracket()}
          </div>
        </div>
      </div>
    `;
  }

  private renderWinner() {
    const state = store.getState();
    const { tournament } = state;

    if (!tournament.isComplete || tournament.rounds.length === 0) {
      return "";
    }

    const finalRound = tournament.rounds[tournament.rounds.length - 1];
    const finalMatch = finalRound.matches[0];
    const winner =
      finalMatch.winner === finalMatch.agent1.uuid
        ? finalMatch.agent1
        : finalMatch.agent2;

    return `
      <div class="winner-container">
        <div class="winner-header">
          <h2 class="winner-title">¡CAMPEÓN DEL TORNEO!</h2>
          <div class="title-decoration">
            <div class="title-line"></div>
            <div class="title-diamond"></div>
            <div class="title-line"></div>
          </div>
        </div>
        
        <div class="winner-content">
          <div class="winner-card-container">
            <agent-card id="winner-card"></agent-card>
            <div class="victory-badge">VICTORIA</div>
          </div>
          
          <div class="winner-info">
            <h3 class="winner-name">${winner.displayName}</h3>
            ${
              winner.role
                ? `<div class="winner-role">${winner.role.displayName}</div>`
                : ""
            }
            <p class="winner-message">¡${
              winner.displayName
            } ha derrotado a todos sus oponentes y se ha coronado como el mejor agente de Valorant!</p>
            <button id="reset-button" class="reset-button">REINICIAR TORNEO</button>
          </div>
        </div>
      </div>
    `;
  }

  private renderError() {
    return `
      <div class="error-container">
        <h2 class="error-title">Error</h2>
        <p class="error-message">${this.loadingError}</p>
        <button id="retry-button" class="primary-button">Reintentar</button>
      </div>
    `;
  }

  private render() {
    if (!this.shadowRoot) return;

    if (this.loadingError) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            font-family: "Roboto", sans-serif;
          }
          
          .error-container {
            max-width: 600px;
            margin: 100px auto;
            text-align: center;
            padding: 30px;
            background-color: #0F1923;
            border: 2px solid #1F2731;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          
          .error-title {
            color: #FF4655;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 0;
            margin-bottom: 20px;
            font-family: 'Valorant', 'Roboto', sans-serif;
          }
          
          .error-message {
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.5;
          }
          
          .primary-button {
            background-color: #FF4655;
            color: white;
            border: none;
            padding: 15px 30px;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
            font-size: 16px;
          }
          
          .primary-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(255, 70, 85, 0.4);
          }
        </style>
        ${this.renderError()}
      `;

      this.shadowRoot
        .getElementById("retry-button")
        ?.addEventListener("click", () => {
          this.handleReset();
        });

      return;
    }

    const state = store.getState();
    const { tournament } = state;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: "Roboto", sans-serif;
          --primary-color: #FF4655;
          --primary-color-light: rgba(255, 70, 85, 0.2);
          --dark-bg: #0F1923;
          --dark-bg-lighter: #1F2731;
          --dark-bg-lightest: #26313D;
          --text-color: white;
          --secondary-text: #8F98A0;
        }
        
        .app-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 15px 0;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          padding: 0 20px;
        }
        
        .title {
          color: var(--primary-color);
          font-size: 48px;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0;
          position: relative;
          display: inline-block;
          padding: 0 20px 15px;
          font-family: 'Valorant', 'Roboto', sans-serif;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        
        .title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        }
        
        .subtitle {
          color: var(--secondary-text);
          font-size: 18px;
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .tournament-layout {
          display: flex;
          flex-direction: column;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .main-row {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 60px;
          padding: 0 15px;
        }
        
        .bracket-row {
          padding: 0 15px;
        }
        
        .bracket-container {
          width: 100%;
          overflow-x: auto;
          max-width: 100%;
        }
        
        .main-content {
          background-color: var(--dark-bg);
          border: 2px solid var(--dark-bg-lighter);
          padding: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: auto;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .main-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(255, 255, 255, 0.02)" d="M50,0 L100,50 L50,100 L0,50 Z"/></svg>');
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        
        .winner-container {
          text-align: center;
          padding: 30px;
          background-color: var(--dark-bg);
          border: 2px solid var(--dark-bg-lighter);
          margin: 0 auto;
          max-width: 800px;
          color: var(--text-color);
          animation: fadeIn 1s ease;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .winner-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at center, rgba(255, 70, 85, 0.1) 0%, rgba(15, 25, 35, 0) 70%),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(255, 255, 255, 0.02)" d="M50,0 L100,50 L50,100 L0,50 Z"/></svg>');
          background-size: cover, 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        
        .winner-header {
          margin-bottom: 30px;
          position: relative;
        }
        
        .winner-title {
          color: var(--primary-color);
          font-size: 36px;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0 0 15px;
          position: relative;
          display: inline-block;
          font-family: 'Valorant', 'Roboto', sans-serif;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        
        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px auto;
          width: 80%;
          max-width: 500px;
        }
        
        .title-line {
          height: 2px;
          background: linear-gradient(to var(--direction, right), transparent, var(--primary-color));
          flex-grow: 1;
        }
        
        .title-diamond {
          width: 12px;
          height: 12px;
          background-color: var(--primary-color);
          transform: rotate(45deg);
          margin: 0 15px;
        }
        
        .winner-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          margin-top: 30px;
          position: relative;
          z-index: 1;
        }
        
        .winner-card-container {
          width: 300px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3));
        }
        
        .winner-card-container::before,
        .winner-card-container::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          background-color: var(--primary-color);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
        .winner-card-container::before {
          top: -20px;
          left: -20px;
          animation-delay: 0.5s;
        }
        
        .winner-card-container::after {
          bottom: -20px;
          right: -20px;
        }
        
        .victory-badge {
          position: absolute;
          top: -15px;
          right: -15px;
          background-color: var(--primary-color);
          color: white;
          font-weight: bold;
          padding: 8px 15px;
          clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
          transform: rotate(10deg);
          font-size: 14px;
          letter-spacing: 1px;
          z-index: 3;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .winner-info {
          text-align: left;
          max-width: 400px;
        }
        
        .winner-name {
          font-size: 32px;
          font-weight: bold;
          color: white;
          margin: 0 0 5px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'Valorant', 'Roboto', sans-serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .winner-role {
          font-size: 16px;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          display: inline-block;
          position: relative;
          padding: 5px 15px;
          background-color: rgba(255, 70, 85, 0.1);
          clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
        }
        
        .winner-message {
          font-size: 18px;
          margin: 20px 0 30px;
          line-height: 1.6;
          color: var(--secondary-text);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        .reset-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 15px 30px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
        }
        
        .reset-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.5s;
        }
        
        .reset-button:hover::before {
          left: 100%;
        }
        
        .reset-button:hover {
          box-shadow: 0 0 15px rgba(255, 70, 85, 0.5);
          transform: translateY(-3px);
        }
        
        .current-match-container {
          margin-bottom:5px;
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .round-name {
          font-size: 24px;
          color: var(--text-color);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin: 0 0 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--dark-bg-lighter);
          position: relative;
          font-family: 'Valorant', 'Roboto', sans-serif;
          text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        }
        
        .round-name::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: var(--primary-color);
        }
        
        .bracket-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .tournament-bracket {
          background-color: var(--dark-bg);
          padding: 20px;
          margin-bottom: 25px;
          border: 2px solid var(--dark-bg-lighter);
          color: var(--text-color);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .tournament-bracket::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path fill="rgba(255, 255, 255, 0.02)" d="M50,0 L100,50 L50,100 L0,50 Z"/></svg>');
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }
        
        .bracket-title {
          font-size: 22px;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin: 0 0 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--dark-bg-lighter);
          position: relative;
          font-family: 'Valorant', 'Roboto', sans-serif;
        }
        
        .bracket-title::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 2px;
          background: var(--primary-color);
        }
        
        .rounds-container {
          display: flex;
          overflow-x: auto;
          padding-bottom: 15px;
          position: relative;
          z-index: 1;
          gap: 20px;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-color) var(--dark-bg-lighter);
        }
        
        .rounds-container::-webkit-scrollbar {
          height: 8px;
        }
        
        .rounds-container::-webkit-scrollbar-track {
          background: var(--dark-bg-lighter);
          border-radius: 4px;
        }
        
        .rounds-container::-webkit-scrollbar-thumb {
          background-color: var(--primary-color);
          border-radius: 4px;
        }
        
        .round {
          min-width: 210px;
          padding: 0 5px;
          flex-shrink: 0;
        }
        
        .round-name {
          font-size: 16px;
          margin-bottom: 15px;
          text-align: center;
          color: var(--secondary-text);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .matches {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .bracket-match {
          background-color: var(--dark-bg-lighter);
          padding: 8px;
          transition: all 0.3s;
          border-left: 3px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .bracket-match.current {
          border-left: 3px solid var(--primary-color);
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          background-color: var(--dark-bg-lightest);
        }
        
        .bracket-match.completed {
          border: 1px solid rgba(255, 70, 85, 0.2);
          background-color: rgba(31, 39, 49, 0.8);
        }
        
        .bracket-match::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: var(--primary-color);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .bracket-match:hover::before {
          opacity: 0.8;
        }
        
        .bracket-agent {
          padding: 10px;
          position: relative;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          border-bottom: 1px solid #36414d;
          background-color: var(--dark-bg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 30px;
          transition: all 0.2s;
        }
        
        .agent-content {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
          width: 100%;
        }
        
        .agent-icon-wrapper {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          background-color: var(--dark-bg-lighter);
        }
        
        .agent-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.2);
        }
        
        .bracket-agent.winner {
          color: var(--primary-color);
          font-weight: bold;
          letter-spacing: 0.5px;
          background-color: rgba(255, 70, 85, 0.1);
          position: relative;
        }
        
        .winner-mark {
          background-color: var(--primary-color);
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }
        
        .bracket-agent.empty {
          opacity: 0.5;
          font-style: italic;
          justify-content: center;
          color: var(--secondary-text);
        }
        
        .vs-divider {
          font-size: 12px;
          text-align: center;
          color: var(--secondary-text);
          padding: 3px 0;
          font-weight: 500;
          background-color: rgba(255, 70, 85, 0.1);
        }
        
        .sidebar-container {
          position: sticky;
          top: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .loading-text {
          color: var(--primary-color);
          font-size: 16px;
          text-align: center;
          padding: 20px;
          position: relative;
          display: inline-block;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
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
        
        @media (max-width: 1000px) {
          .main-row {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .sidebar-container {
            position: static;
          }
          
          .winner-content {
            flex-direction: column;
          }
          
          .winner-info {
            text-align: center;
          }
        }
        
        @media (max-width: 768px) {
          .app-container {
            padding: 15px 0;
          }
          
          .title {
            font-size: 32px;
            padding: 0 10px 10px;
          }
          
          .winner-title {
            font-size: 28px;
          }
          
          .winner-container {
            padding: 20px;
          }
          
          .round {
            min-width: 180px;
          }
          
          .bracket-agent {
            font-size: 12px;
            padding: 8px;
          }
        }

        #current-matchup {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
      </style>
      
      <div class="app-container">
        <header class="header">
          <h1 class="title">Torneo de Agentes de Valorant</h1>
          <p class="subtitle">¡Vota por tus agentes favoritos!</p>
        </header>
        
        ${
          tournament.isComplete
            ? this.renderWinner()
            : this.renderTournamentLayout()
        }
      </div>
    `;

    // Agregar funcionalidad a los elementos después de renderizar
    if (tournament.isComplete) {
      const winnerCard = this.shadowRoot.getElementById(
        "winner-card"
      ) as HTMLElement & { agentData: Agent };
      if (winnerCard) {
        const finalRound = tournament.rounds[tournament.rounds.length - 1];
        const finalMatch = finalRound.matches[0];
        const winner =
          finalMatch.winner === finalMatch.agent1.uuid
            ? finalMatch.agent1
            : finalMatch.agent2;
        winnerCard.agentData = winner;
        winnerCard.setAttribute("selected", "");
        winnerCard.setAttribute("selectable", "false");
      }

      this.shadowRoot
        .getElementById("reset-button")
        ?.addEventListener("click", () => {
          this.handleReset();
        });
    } else if (tournament.rounds.length > 0) {
      const currentRound = tournament.rounds[tournament.currentRound];
      const currentMatch = currentRound.matches[tournament.currentMatch];
      const matchupElement = this.shadowRoot.getElementById(
        "current-matchup"
      ) as HTMLElement & {
        matchup: { agent1: Agent; agent2: Agent; winner: string | null };
      };

      if (matchupElement) {
        matchupElement.matchup = {
          agent1: currentMatch.agent1,
          agent2: currentMatch.agent2,
          winner: currentMatch.winner,
        };
      }
    }
  }
}
