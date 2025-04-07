import { WeaponsResponse } from "../types/WeaponTypes.type";

function getWeaponsFromValorantAPI(): Promise<WeaponsResponse> {
  return fetch("https://valorant-api.com/v1/weapons")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error status: ${response.status}`);
      }
      return response.json() as Promise<WeaponsResponse>;
    })
    .catch((error) => {
      console.error("Error fetching weapons data:", error);
      throw error;
    });
}

export default getWeaponsFromValorantAPI;

// this is the service that gets the weapons from the valorant api with a promise
