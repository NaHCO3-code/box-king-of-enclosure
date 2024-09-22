import Component from "component";
import { KEnclose } from "./Enclose";
import { KEmitter } from "./Events";
import { KEvents } from "./Interfaces";
import { KTeamManager } from "./TeamManager";
import { Rich } from "./lib/Rich";

export class KGameManager extends Component {
  model: KEnclose;
  teamMgr: KTeamManager;

  constructor(){
    super();
    this.model = new KEnclose();
    this.teamMgr = new KTeamManager();
    KEmitter.on(KEvents.VoxelContact, (x, y, team) => {
      this.model.voxelsToUpdate.push([x, y, team]);
    });
  }

  startGame(): void {
    this.model.init();
    this.teamMgr.clear();
    this.teamMgr.alloc();
  }

  protected onUpdate(deltaTime: number): void {
    this.model.updateVoxels();
    for(let i = 0; i < this.teamMgr.teamNum; ++i)
      this.model.calcDomain(i+1);
  }
}