import {
  ActionTypes,
  LoadAgentsAction,
  SetMatchupAction,
  VoteForAgentAction,
  AdvanceTournamentAction,
  ResetTournamentAction,
  SetTournamentStructureAction,
} from "../types/flux";
import { Agent } from "../types/api";
import { store } from "./Store";

// Creación de acciones

// cargar una lista de agentes
export const loadAgents = (agents: Agent[]): LoadAgentsAction => {
  return {
    type: ActionTypes.LOAD_AGENTS,
    payload: agents,
  };
};

// establecer un emparejamiento
export const setMatchup = (agent1: Agent, agent2: Agent): SetMatchupAction => {
  return {
    type: ActionTypes.SET_MATCHUP,
    payload: { agent1, agent2 },
  };
};

// votar por un agente
export const voteForAgent = (agentUuid: string): VoteForAgentAction => {
  return {
    type: ActionTypes.VOTE_FOR_AGENT,
    payload: agentUuid,
  };
};

// avanzar al siguiente emparejamiento
export const advanceTournament = (): AdvanceTournamentAction => {
  return {
    type: ActionTypes.ADVANCE_TOURNAMENT,
  };
};

// reiniciar el torneo
export const resetTournament = (): ResetTournamentAction => {
  return {
    type: ActionTypes.RESET_TOURNAMENT,
  };
};

// Función para inicializar el torneo con los agentes
export const initializeTournament = (agents: Agent[]): void => {
  // Primero cargar los agentes
  store.dispatch(loadAgents(agents));

  // Filtrar solo los agentes jugables, aun que creo que todos los agentes son jugables acá
  const playableAgents = agents.filter((agent) => agent.isPlayableCharacter);

  // Verificar que tenemos suficientes agentes para un torneo (mínimo 2) sino no se puede jugar
  if (playableAgents.length < 2) {
    console.error(
      "No hay suficientes agentes jugables para un torneo (mínimo 2 requeridos)"
    );
    return;
  }

  // Mezclar los agentes para crear emparejamientos aleatorios con math.random vaciando el playableAgents
  const shuffledAgents = [...playableAgents].sort(() => Math.random() - 0.5);

  // Asegurarnos que tenemos un número par de agentes
  const adjustedAgents =
    shuffledAgents.length % 2 === 0
      ? shuffledAgents
      : shuffledAgents.slice(0, shuffledAgents.length - 1);

  // Crear los emparejamientos iniciales de los octavos de final
  const initialMatches = [];
  for (let i = 0; i < adjustedAgents.length; i += 2) {
    initialMatches.push({
      agent1: adjustedAgents[i],
      agent2: adjustedAgents[i + 1],
      winner: null,
    });
  }

  // Verificar que tenemos al menos un enfrentamiento creado
  if (initialMatches.length === 0) {
    console.error("No se pudieron crear emparejamientos para el torneo");
    return;
  }

  // Determinar los nombres de las rondas para el roundNames como header
  const roundNames = [];
  let remainingMatches = initialMatches.length;
  while (remainingMatches >= 1) {
    if (remainingMatches >= 8) roundNames.push("Octavos de final");
    else if (remainingMatches >= 4) roundNames.push("Cuartos de final");
    else if (remainingMatches >= 2) roundNames.push("Semifinal");
    else roundNames.push("Final");
    remainingMatches = Math.floor(remainingMatches / 2);
  }

  // Crear la estructura inicial del torneo
  const initialRounds = [
    {
      name: roundNames[0],
      matches: initialMatches,
    },
  ];

  // Para las rondas siguientes, slots vacíos que se llenarán a medida que avanza el torneo
  for (let i = 1; i < roundNames.length; i++) {
    const previousRoundMatchCount = initialRounds[i - 1].matches.length;
    // Asegurarnos de que currentRoundMatchCount sea un entero válido
    const currentRoundMatchCount = Math.floor(previousRoundMatchCount / 2);

    if (currentRoundMatchCount <= 0) {
      console.error(
        `Cantidad de partidos inválida en la ronda ${i}: ${currentRoundMatchCount}`
      );
      continue; // hace que el bucle pase inmediatamente a la siguiente iteración Si currentRoundMatchCount > 0:
      // Si currentRoundMatchCount > 0:  el continue no se ejecuta, por lo que el código sigue adelante y crea la nueva ronda con los partidos vacíos.
    }

    const emptyMatches = Array(currentRoundMatchCount)
      .fill(null)
      .map(() => ({
        agent1: null as unknown as Agent,
        agent2: null as unknown as Agent,
        winner: null,
      }));

    initialRounds.push({
      name: roundNames[i],
      matches: emptyMatches,
    });
  }
  // Verificar que tenemos al menos una ronda
  if (initialRounds.length === 0) {
    console.error("No se pudieron crear rondas para el torneo");
    return;
  }

  // Actualizar el estado con la estructura del torneo
  store.dispatch({
    type: ActionTypes.RESET_TOURNAMENT,
  });

  console.info("Estableciendo estructura del torneo, ya casi");

  // Establecer la estructura del torneo
  const tournamentPayload = {
    rounds: initialRounds,
    currentRound: 0,
    currentMatch: 0,
    isComplete: false,
  };

  store.dispatch({
    type: ActionTypes.SET_TOURNAMENT_STRUCTURE,
    payload: tournamentPayload,
  } as SetTournamentStructureAction);
  console.info(
    "Todo bien, torneo inicializado correctamente",
    tournamentPayload
  );
};
