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
