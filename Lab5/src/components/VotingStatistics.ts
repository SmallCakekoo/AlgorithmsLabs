import { store } from "../flux/Store";
import { Agent } from "../types/api";

export default class VotingStatistics extends HTMLElement {
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Suscribirse a cambios en el store
    this.unsubscribe = store.subscribe(() => {
      this.render();
    });

    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private getTopAgents(limit: number = 5): { agent: Agent; votes: number }[] {
    const state = store.getState();
    const { agents, statistics } = state;

    if (agents.length === 0) return [];

    const agentsWithVotes = agents
      .filter(
        (agent) =>
          statistics.agentVotes[agent.uuid] &&
          statistics.agentVotes[agent.uuid] > 0
      )
      .map((agent) => ({
        agent,
        votes: statistics.agentVotes[agent.uuid] || 0,
      }))
      .sort((a, b) => b.votes - a.votes);

    return agentsWithVotes.slice(0, limit);
  }

  private render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const { statistics } = state;
    const topAgents = this.getTopAgents();
    const hasVotes = statistics.totalVotes > 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .stats-container {
          background-color: #0F1923;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          margin-bottom: 20px;
          color: white;
          border: 2px solid #1F2731;
        }
        
        .stats-title {
          font-size: 24px;
          color: white;
          margin-top: 0;
          margin-bottom: 16px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .stats-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 2px;
          background-color: #FF4655;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 12px;
          background-color: #1F2731;
          clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        
        .stat-card:hover {
          transform: translateX(5px);
          border-left: 3px solid #FF4655;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }
        
        .agent-info {
          display: flex;
          align-items: center;
        }
        
        .agent-icon {
          width: 45px;
          height: 45px;
          object-fit: cover;
          border-radius: 50%;
          margin-right: 12px;
          background-color: #131E29;
          padding: 3px;
          border: 1px solid #364049;
        }
        
        .agent-name {
          font-weight: bold;
          color: white;
          letter-spacing: 1px;
        }
        
        .agent-role {
          font-size: 12px;
          color: #8F98A0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 3px;
        }
        
        .vote-count {
          background-color: #FF4655;
          color: white;
          clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
          padding: 6px 12px;
          font-weight: bold;
          min-width: 40px;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .total-stat {
          font-size: 18px;
          text-align: center;
          margin: 20px 0;
          color: white;
          background-color: #1F2731;
          padding: 15px;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        
        .total-number {
          font-size: 28px;
          font-weight: bold;
          color: #FF4655;
          display: block;
          margin-top: 5px;
        }
        
        .no-votes {
          text-align: center;
          padding: 20px;
          color: #8F98A0;
          background-color: #1F2731;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
         
        h3 {
          color: white;
          text-transform: uppercase;
          font-size: 16px;
          letter-spacing: 1px;
          margin: 20px 0 15px;
          padding-left: 10px;
          border-left: 3px solid #FF4655;
        }
      </style>
      
      <div class="stats-container">
        <h2 class="stats-title">Estadísticas de Votación</h2>
        
        ${
          hasVotes
            ? `
          <div class="total-stat">
            Total de votos: <span class="total-number">${
              statistics.totalVotes
            }</span>
          </div>
          
          ${
            topAgents.length > 0
              ? `
            <h3>Tu top 5</h3>
            ${topAgents
              .map(
                (item, index) => `
              <div class="stat-card">
                <div class="agent-info">
                  <img class="agent-icon" src="${
                    item.agent.displayIcon
                  }" alt="${item.agent.displayName}">
                  <div>
                    <div class="agent-name">${index + 1}. ${
                  item.agent.displayName
                }</div>
                    ${
                      item.agent.role
                        ? `<div class="agent-role">${item.agent.role.displayName}</div>`
                        : ""
                    }
                  </div>
                </div>
                <div class="vote-count">${item.votes}</div>
              </div>
            `
              )
              .join("")}
          `
              : ""
          }
        `
            : `
          <div class="no-votes">
            Aún no hay votos registrados. ¡Vota por tus agentes favoritos!
          </div>
        `
        }
      </div>
    `;
  }
}
