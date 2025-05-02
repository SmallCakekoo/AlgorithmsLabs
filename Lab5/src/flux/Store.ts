import { AppState, ValorantActions, ActionTypes } from "../types/flux";

// Estado inicial del store como el myState
const initialState: AppState = {
  agents: [],
  tournament: {
    rounds: [],
    currentRound: 0,
    currentMatch: 0,
    isComplete: false,
  },
  statistics: {
    totalVotes: 0,
    agentVotes: {}, // UUID del agente -> número de votos
  },
  lastSaved: null,
};

// Reducer como si fuera mi handleActions
const reducer = (
  state: AppState = initialState,
  action: ValorantActions
): AppState => {
  let newState: AppState;

  switch (action.type) {
    case ActionTypes.LOAD_AGENTS:
      newState = {
        ...state,
        agents: action.payload,
      };
      break;

    case ActionTypes.SET_MATCHUP:
      // Actualizar el matchup con los datos del payload
      newState = {
        ...state,
        tournament: {
          ...state.tournament,
          // Si hay un payload específico, usarlo, sino mantener el estado actual
          ...(action.payload ? { matches: action.payload } : {}),
        },
      };
      break;

    case ActionTypes.VOTE_FOR_AGENT: {
      if (state.tournament.rounds.length === 0) {
        console.warn("Intentando votar sin rondas inicializadas");
        return state;
      }

      const rounds = JSON.parse(JSON.stringify(state.tournament.rounds)); // Deep copy
      const currentRound = rounds[state.tournament.currentRound];

      if (!currentRound) {
        console.error("Ronda actual no encontrada");
        return state;
      }

      const currentMatch = currentRound.matches[state.tournament.currentMatch];

      if (!currentMatch) {
        console.error("Match actual no encontrado");
        return state;
      }

      // Registrar el voto en el match
      currentMatch.winner = action.payload;

      // Actualizar estadísticas
      const agentUuid = action.payload;
      const agentVotes = { ...state.statistics.agentVotes };

      // Incrementar contador para este agente
      agentVotes[agentUuid] = (agentVotes[agentUuid] || 0) + 1;

      newState = {
        ...state,
        tournament: {
          ...state.tournament,
          rounds,
        },
        statistics: {
          totalVotes: state.statistics.totalVotes + 1,
          agentVotes,
        },
      };
      break;
    }

    case ActionTypes.ADVANCE_TOURNAMENT: {
      if (state.tournament.rounds.length === 0) {
        return state;
      }

      const currentRoundIndex = state.tournament.currentRound;
      const currentMatchIndex = state.tournament.currentMatch;
      const totalMatches =
        state.tournament.rounds[currentRoundIndex].matches.length;

      // Si es el último match del round actual
      if (currentMatchIndex === totalMatches - 1) {
        // Si es el último round, marcar como completo
        if (currentRoundIndex === state.tournament.rounds.length - 1) {
          newState = {
            ...state,
            tournament: {
              ...state.tournament,
              isComplete: true,
            },
          };
        } else {
          // Crear los emparejamientos para la siguiente ronda
          const winners = state.tournament.rounds[
            currentRoundIndex
          ].matches.map((match) => {
            // Encontrar el agente ganador
            const winnerAgent =
              match.winner === match.agent1.uuid ? match.agent1 : match.agent2;
            return winnerAgent;
          });

          // Crear nuevos matches con los ganadores
          const nextRoundMatches =
            state.tournament.rounds[currentRoundIndex + 1].matches;
          for (let i = 0; i < nextRoundMatches.length; i++) {
            nextRoundMatches[i].agent1 = winners[i * 2];
            nextRoundMatches[i].agent2 = winners[i * 2 + 1];
          }

          // Avanzar al siguiente round
          newState = {
            ...state,
            tournament: {
              ...state.tournament,
              currentRound: currentRoundIndex + 1,
              currentMatch: 0,
            },
          };
        }
      } else {
        // Avanzar al siguiente match dentro del mismo round
        newState = {
          ...state,
          tournament: {
            ...state.tournament,
            currentMatch: currentMatchIndex + 1,
          },
        };
      }
      break;
    }

    case ActionTypes.RESET_TOURNAMENT:
      // Mantener los agentes pero resetear el torneo y estadísticas
      newState = {
        ...state,
        tournament: initialState.tournament,
        statistics: initialState.statistics,
      };
      break;

    case ActionTypes.SET_TOURNAMENT_STRUCTURE:
      // console.info("Actualizando estructura del torneo:", action.payload);
      newState = {
        ...state,
        tournament: {
          ...state.tournament,
          ...action.payload,
        },
      };
      break;

    default:
      return state;
  }

  return newState;
};

// Instancia del store
class Store {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor() {
    // Inicializar con el estado inicial
    this.state = initialState;
  }

  getState(): AppState {
    return this.state;
  }

  dispatch(action: ValorantActions): void {
    // console.info("Dispatch de acción:", action.type, action.payload);

    // Aplicar el reducer y actualizar el estado
    this.state = reducer(this.state, action);

    // Notificar a los componentes para que se actualicen
    this.notifyListeners();
  }

  // Suscribe una función listener para ser notificada cuando el estado cambie
  // Se recibe una Función callback a ejecutar en cada actualización
  // Retorna una función para cancelar la suscripción (unsubscribe)
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // limpiar el estado del store para reiniciar el torneo
  clearStorage(): void {
    const currentAgents = this.state.agents;

    this.state = {
      ...initialState,
      agents: currentAgents,
    };

    // console.info("Torneo reiniciado");
    this.notifyListeners();
  }
}

// Exportar una única instancia del store
export const store = new Store();
