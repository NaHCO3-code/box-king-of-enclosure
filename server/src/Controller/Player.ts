import Component from "component";
import { KEmitter } from "../Events";
import { KEvents, TeamId } from "../Constants";

export class Player extends Component {
  static players: Player[] = [];
  entity: GamePlayerEntity;
  team: TeamId | null = null;

  constructor(entity: GamePlayerEntity) {
    super();
    this.entity = entity;
    this.entity.onVoxelContact((event: GameVoxelContactEvent) => this.onVoxelContact(event));
    this.entity.player.cameraMode = GameCameraMode.FPS;
  }

  onVoxelContact(event: GameVoxelContactEvent){
    const { x, z } = event;
    if(this.team === null) return;
    KEmitter.emit(KEvents.VoxelContact, x, z, this.team);
  }

  findPlayerByBoxId(boxId: string){
    return Player.players.find(e => e.entity.player.boxId === boxId);
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
