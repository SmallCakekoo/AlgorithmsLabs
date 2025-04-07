export type WeaponsResponse = {
  status: number;
  data: Weapon[];
};

export type Weapon = {
  uuid: string;
  displayName: string;
  category: string;
  defaultSkinUuid: string;
  displayIcon: string;
  killStreamIcon: string;
  assetPath: string;
  weaponStats: WeaponStats | null;
  shopData: ShopData | null;
  skins: Skin[];
};

export type WeaponStats = {
  fireRate: number;
  magazineSize: number;
  runSpeedMultiplier: number;
  equipTimeSeconds: number;
  reloadTimeSeconds: number;
  firstBulletAccuracy: number;
  shotgunPelletCount: number;
  wallPenetration: string;
  feature: string | null;
  fireMode: string | null;
  altFireType: string | null;
  adsStats: AdsStats | null;
  altShotgunStats: AltShotgunStats | null;
  airBurstStats: AirBurstStats | null;
  damageRanges: DamageRange[];
};

export type AdsStats = {
  zoomMultiplier: number;
  fireRate: number;
  runSpeedMultiplier: number;
  burstCount: number;
  firstBulletAccuracy: number;
};

export type AltShotgunStats = {
  shotgunPelletCount: number;
  burstRate: number;
};

export type AirBurstStats = {
  shotgunPelletCount: number;
  burstDistance: number;
};

export type DamageRange = {
  rangeStartMeters: number;
  rangeEndMeters: number;
  headDamage: number;
  bodyDamage: number;
  legDamage: number;
};

export type ShopData = {
  cost: number;
  category: string;
  categoryText: string;
  gridPosition: GridPosition | null;
  canBeTrashed: boolean;
  image: string | null;
  newImage: string | null;
  newImage2: string | null;
  assetPath: string;
};

export type GridPosition = {
  row: number;
  column: number;
};

export type Skin = {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string | null;
  displayIcon: string | null;
  wallpaper: string | null;
  assetPath: string;
  chromas: Chroma[];
  levels: Level[];
};

export type Chroma = {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string;
  swatch: string | null;
  streamedVideo: string | null;
  assetPath: string;
};

export type Level = {
  uuid: string;
  displayName: string;
  levelItem: string | null;
  displayIcon: string | null;
  streamedVideo: string | null;
  assetPath: string;
};
