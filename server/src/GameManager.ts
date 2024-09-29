import Component from "component";
import { KEnclose } from "./Enclose";
import { KEmitter } from "./Events";
import { KEvents, MAP_SIZE, MAP_ZINDEX } from "./Interfaces";
import { KTeamManager, Teams } from "./TeamManager";
import { Rich } from "./lib/Rich";
import { Listener } from "./lib/Emitter";

export class KGameManager extends Component {
  model: KEnclose;
  teamMgr: KTeamManager;
  voxelContactListener: Listener | null;

  constructor(){
    super();
    this.model = new KEnclose();
    this.teamMgr = new KTeamManager();
    this.voxelContactListener = null;
  }

  startGame(): void {
    this.model.init();
    this.teamMgr.clear();
    this.teamMgr.alloc();
    this.voxelContactListener = KEmitter.on(KEvents.VoxelContact, (x, y, team) => {
      this.model.setVoxel(x, y, team);
    });
  }

  endGame(): void {
    this.teamMgr.clear();
    this.voxelContactListener?.cancel();
  }

  protected onUpdate(deltaTime: number): void {
    this.model.update(this.teamMgr.teamNum);
  }
}