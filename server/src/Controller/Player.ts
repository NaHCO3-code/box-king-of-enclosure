import Component from "component";
import { KEmitter } from "../Events";
import { KEvents, TeamId } from "../Constants";

export class Player {
  entity: GamePlayerEntity;
  team: TeamId | null = null;

  constructor(entity: GamePlayerEntity) {
    this.entity = entity;
    this.entity.onVoxelContact((event: GameVoxelContactEvent) => this.onVoxelContact(event));
    this.entity.player.cameraMode = GameCameraMode.FPS;
  }

  onVoxelContact(event: GameVoxelContactEvent){
    const { x, z } = event;
    if(this.team === null) return;
    KEmitter.emit(KEvents.VoxelContact, x, z, this.team);
  }

  static players: Player[] = [];

  static findPlayerByBoxId(userId: string){
    return Player.players.find(e => e.entity.player.userId === userId);
  }

  static create(entity: GamePlayerEntity){
    Player.players.push(new Player(entity));
  }

  static delete(entity: GamePlayerEntity){
    Player.players.splice(
      Player.players.findIndex(
        e => entity.player.userId === e.entity.player.userId
      ), 
      1
    );
  }
}
