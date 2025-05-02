export interface ValoriantApiResponse {
  status: number;
  data: Agent[];
}

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  characterTags: string[] | null;
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string | null;
  fullPortrait: string | null;
  fullPortraitV2: string | null;
  killfeedPortrait: string;
  background: string | null;
  backgroundGradientColors: string[] | null;
  assetPath: string;
  isFullPortraitRightFacing: boolean;
  isPlayableCharacter: boolean;
  isAvailableForTest: boolean;
  isBaseContent: boolean;
  role: Role | null;
  recruitmentData: RecruitmentData | null;
  abilities: Ability[];
  voiceLine: VoiceLine | null;
}

export interface Role {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  assetPath: string;
}

export interface RecruitmentData {
  counterId: string;
  milestoneId: string;
  milestoneThreshold: number;
  useLevelVpCostOverride: boolean;
  levelVpCostOverride: number;
  startDate: string;
  endDate: string;
}

export interface Ability {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string | null;
}

export interface VoiceLine {
  minDuration: number;
  maxDuration: number;
  mediaList: Media[];
}

export interface Media {
  id: number;
  wwise: string;
  wave: string;
}
