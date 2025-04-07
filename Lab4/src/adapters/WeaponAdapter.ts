import { Weapon } from "../types/WeaponTypes.type";

// my interface data
export interface TransformedWeapon {
  uuid: string;
  displayName: string;
  displayIcon: string;
  category: string;
  weaponStats: {
    fireRate: number;
    magazineSize: number;
    runSpeedMultiplier: number;
    equipTimeSeconds: number;
    reloadTimeSeconds: number;
    damageRanges: Array<{
      rangeStartMeters: number;
      rangeEndMeters: number;
      headDamage: number;
      bodyDamage: number;
      legDamage: number;
    }>;
  };
  skins: Array<{
    uuid: string;
    displayName: string;
    displayIcon: string | null;
  }>;
  damage: string;
  fireRate: string;
  magazineSize: string;
  reloadTime: string;
  price: string;
}

// my adapter
export const transformWeapon = (weapon: Weapon): TransformedWeapon => {
  const damageRanges = weapon.weaponStats?.damageRanges || [];
  const maxDamage =
    damageRanges.length > 0
      ? Math.max(...damageRanges.map((range) => range.headDamage))
      : 0;

  return {
    uuid: weapon.uuid,
    displayName: weapon.displayName,
    displayIcon: weapon.displayIcon,
    category: weapon.category,
    weaponStats: weapon.weaponStats || {
      fireRate: 0,
      magazineSize: 0,
      runSpeedMultiplier: 0,
      equipTimeSeconds: 0,
      reloadTimeSeconds: 0,
      damageRanges: [],
    },
    skins: weapon.skins || [],
    damage: maxDamage.toString(),
    fireRate: weapon.weaponStats?.fireRate?.toFixed(1) || "0",
    magazineSize: weapon.weaponStats?.magazineSize?.toString() || "0",
    reloadTime: weapon.weaponStats?.reloadTimeSeconds?.toFixed(1) || "0", // rounds the number and displays it to a single decimal place.
    price: weapon.shopData?.cost ? `${weapon.shopData.cost} credits` : "Free",
  };
};

// my adapter class
export class WeaponAdapter {
  public static transformWeapons(weapons: Weapon[]): TransformedWeapon[] {
    return weapons.map((weapon) => transformWeapon(weapon));
  }
}
