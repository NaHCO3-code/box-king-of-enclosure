import Component from "component";
import { KEmitter } from "@/Events";
import { KEvents, TeamId } from "@/Constants";
import { SPlayed } from "./Storage";
import { Rich } from "@/lib/Rich";
import { RemoteEvent } from "@/RemoteEvent";

export class Player {
  entity: GamePlayerEntity;
  team: TeamId | null = null;
  joinNextGame: boolean = false;

  constructor(entity: GamePlayerEntity) {
    this.entity = entity;
    this.entity.onVoxelContact((event: GameVoxelContactEvent) => this.onVoxelContact(event));
    this.entity.player.cameraMode = GameCameraMode.FPS;
    this.entity.player.spectator = true;
    this.init();
  }

  async init(){
    const isPlayed = await SPlayed.get(this.entity.player.userId);
    if(!isPlayed || Date.now() - isPlayed.updateTime >= 2592000000){
      await SPlayed.set(this.entity.player.userId, true);
      remoteChannel.sendClientEvent(this.entity, {
        type: RemoteEvent.tutorial
      });
    }
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
