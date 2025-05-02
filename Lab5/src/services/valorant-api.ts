import { Agent, ValoriantApiResponse } from "../types/api";

const API_URL = "https://valorant-api.com/v1/agents";

// Fetch general, para obtener a TODOS los agentes
function getAgents(): Promise<Agent[]> {
  return fetch(`${API_URL}?isPlayableCharacter=true`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error status: ${response.status} ${response.statusText}`
        );
      }
      return response.json() as Promise<ValoriantApiResponse>;
    })
    .then((data) => {
      if (!data || !Array.isArray(data.data) || data.data.length === 0) {
        console.error("La API no devolvió agentes válidos:", data);
        return [];
      }
      return data.data.filter((agent) => agent.isPlayableCharacter);
    })
    .catch((error) => {
      console.error("Error al obtener los agentes:", error);
      throw error;
    });
}

// Fetch individual, Obtener la información detallada de un solo agente de Valorant usando su UUID
function getAgentByUuid(uuid: string): Promise<Agent | null> {
  if (!uuid) {
    console.error("UUID no válido proporcionado");
    return Promise.resolve(null);
  }

  return fetch(`${API_URL}/${uuid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error status: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.data) {
        console.error(`No se encontró un agente con UUID ${uuid}`);
        return null;
      }
      return data.data;
    })
    .catch((error) => {
      console.error(`Error al obtener el agente con UUID ${uuid}:`, error);
      return null;
    });
}

export { getAgents, getAgentByUuid };
