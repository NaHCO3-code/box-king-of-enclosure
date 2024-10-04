import { GenEmitterType } from "./lib/Emitter";

export type PosX = number;
export type PosY = number;
export type TeamId = number;

export const KEvents = {
  VoxelContact: "KOE:VoxelContact"
} as const;

export type KEventType = {
  VoxelContact: (x: PosX, y: PosY, teamId: TeamId) => void
}

export type KEventEmitterType = GenEmitterType<typeof KEvents, KEventType>;

export const MAP_SIZE = { x: 255, y: 255 } as const;
export const MAP_ZINDEX = 8;
export const MAP_HEIGHT = 64;
export const MIN_ZONE_SIZE = 16;

export const GAME_TIME = 180;
export const GAME_REST_TIME = 30;
export const WEATHER_CHANGE_TIME = 30;
export const WEATHER_EFFECT_TIME = 3;
