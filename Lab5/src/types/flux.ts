import { Agent } from "./api";

// Interfaces para el sistema de torneo y votación. Enums acá pq me da pereza hacerlos en la carpeta de enums
export enum ActionTypes {
  LOAD_AGENTS = "LOAD_AGENTS",
  SET_MATCHUP = "SET_MATCHUP",
  VOTE_FOR_AGENT = "VOTE_FOR_AGENT",
  ADVANCE_TOURNAMENT = "ADVANCE_TOURNAMENT",
  RESET_TOURNAMENT = "RESET_TOURNAMENT",
  SET_TOURNAMENT_STRUCTURE = "SET_TOURNAMENT_STRUCTURE",
}

export interface Action {
  type: ActionTypes;
  payload?: unknown;
}

export interface LoadAgentsAction extends Action {
  type: ActionTypes.LOAD_AGENTS;
  payload: Agent[];
}

export interface SetMatchupAction extends Action {
  type: ActionTypes.SET_MATCHUP;
  payload: {
    agent1: Agent;
    agent2: Agent;
  };
}

export interface VoteForAgentAction extends Action {
  type: ActionTypes.VOTE_FOR_AGENT;
  payload: string;
}

export interface AdvanceTournamentAction extends Action {
  type: ActionTypes.ADVANCE_TOURNAMENT;
}

export interface ResetTournamentAction extends Action {
  type: ActionTypes.RESET_TOURNAMENT;
}

export interface SetTournamentStructureAction extends Action {
  type: ActionTypes.SET_TOURNAMENT_STRUCTURE;
  payload: {
    rounds: Round[];
    currentRound: number;
    currentMatch: number;
    isComplete: boolean;
  };
}

export type ValorantActions =
  | LoadAgentsAction
  | SetMatchupAction
  | VoteForAgentAction
  | AdvanceTournamentAction
  | ResetTournamentAction
  | SetTournamentStructureAction;

export interface AppState {
  agents: Agent[];
  tournament: {
    rounds: Round[];
    currentRound: number;
    currentMatch: number;
    isComplete: boolean;
  };
  statistics: {
    totalVotes: number;
    agentVotes: { [agentUuid: string]: number };
  };
  lastSaved: string | null;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  agent1: Agent;
  agent2: Agent;
  winner: string | null;
}

// Interfaz para calcular porcentajes de votación
export interface VoteStatistics {
  agent1Votes: number;
  agent2Votes: number;
  agent1Percentage: number;
  agent2Percentage: number;
  totalVotes: number;
}
