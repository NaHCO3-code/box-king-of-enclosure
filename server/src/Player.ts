import Component from "component";
import { KEmitter } from "./Events";
import { KEvents, TeamId } from "./Interfaces";
import { Rich } from "./lib/Rich";

export class Player extends Component {
  static players: Player[] = [];
  entity: GamePlayerEntity;
  team: TeamId | null = null;

  constructor(entity: GamePlayerEntity) {
    super();
    this.entity = entity;
    this.entity.onVoxelContact((event: GameVoxelContactEvent) => this.onVoxelContact(event));
  }

  onVoxelContact(event: GameVoxelContactEvent){
    const { x, z } = event;
    if(this.team === null) return;
    KEmitter.emit(KEvents.VoxelContact, x, z, this.team);
  }

  static create(entity: GamePlayerEntity){
    Player.players.push(new Player(entity));
  }

  static delete(entity: GamePlayerEntity){
    Player.players.splice(
      Player.players.findIndex(
        e => entity.player.boxId === e.entity.player.boxId
      ), 
      1
    );
  }
}
