import Component from "@/Component/Definition";
import { Emit } from "@/Event";
import { KEvents, TeamId } from "@/Constants";
import { SPlayed } from "./Storage";
import { Rich } from "@/lib/Rich";
import { RemoteEvent } from "@shares/RemoteEvent";

export class Player {
  entity: GamePlayerEntity;
  team: TeamId | null = null;
  joinNextGame: boolean = false;

  constructor(entity: GamePlayerEntity) {
    this.entity = entity;
    this.entity.onVoxelContact((event: GameVoxelContactEvent) => this.onVoxelContact(event));
    this.entity.player.cameraMode = GameCameraMode.FOLLOW;
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
    Emit.emit(KEvents.VoxelContact, x, z, this.team);
  }

  static players: Player[] = [];

  static findPlayerByUserId(userId: string){
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

Emit.on(RemoteEvent.alterInvolvement, (event) => {
  const player = Player.findPlayerByUserId(event.entity.player.userId);
  if(!player) return;
  player.joinNextGame = event.args.value;
})
