import Component from "@/Component/Definition";
import { Event } from "@/Event";
import { KEvents, TeamId } from "@/Constants";
import { SPlayed } from "./Storage";
import { Rich } from "@/lib/Rich";
import { RemoteEvent } from "@shares/RemoteEvent";
import { PlayerManager } from "@/PlayerManager";

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
    Event.emit(KEvents.VoxelContact, x, z, this.team);
  }
}

Event.on(RemoteEvent.alterInvolvement, (event) => {
  const player = PlayerManager.instance.findPlayerByUserId(event.entity.player.userId);
  if(!player) return;
  player.joinNextGame = event.args.value;
})
