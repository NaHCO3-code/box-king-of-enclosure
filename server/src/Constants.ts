import { GenEmitterType } from "./lib/Emitter";

export type PosX = number;
export type PosY = number;
export type TeamId = number;

export enum KGameState {
  GAME = "GAME",
  REST = "REST",
}

export enum KGameAction {
  START_GAME = "START_GAME",
  END_GAME = "END_GAME",
}

export const KEvents = {
  VoxelContact: "KOE:VoxelContact",
} as const;

export type KEventType = {
  VoxelContact: (x: PosX, y: PosY, teamId: TeamId) => void;
};

export type KEventEmitterType = GenEmitterType<typeof KEvents, KEventType>;

export const Teams: { name: string; voxel: voxelId }[] = [
  {
    name: "DEFAULT",
    voxel: 95,
  },
  {
    name: "red",
    voxel: 105,
  },
  {
    name: "blue",
    voxel: 91,
  },
  {
    name: "yellow",
    voxel: 121,
  },
  {
    name: "purple",
    voxel: 369,
  },
] as const;

export const MAP_SIZE = { x: 255, y: 255 } as const;
export const MAP_ZINDEX = 8;
export const MAP_HEIGHT = 64;
export const MIN_ZONE_SIZE = 16;

export const GAME_TIME = 120;
export const GAME_REST_TIME = 30;
export const WEATHER_CHANGE_TIME = 30;
