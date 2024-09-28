import Component from "component";
import { KEnclose } from "./Enclose";
import { KEmitter } from "./Events";
import { KEvents, MAP_SIZE, MAP_ZINDEX } from "./Interfaces";
import { KTeamManager, Teams } from "./TeamManager";
import { Rich } from "./lib/Rich";

export class KGameManager extends Component {
  model: KEnclose;
  teamMgr: KTeamManager;

  constructor(){
    super();
    this.model = new KEnclose();
    this.teamMgr = new KTeamManager();
    KEmitter.on(KEvents.VoxelContact, (x, y, team) => {
      this.model.setVoxel(x, y, team);
    });
  }

  startGame(): void {
    this.model.init();
    this.teamMgr.clear();
    this.teamMgr.alloc();
  }

  protected onUpdate(deltaTime: number): void {
    this.model.updateMap();
    for(let i = 1; i <= this.teamMgr.teamNum; ++i)
      this.model.calcDomain(i);
    let awa = this.model.calcEdge();
    for(let i=0; i<MAP_SIZE.x; ++i){
      for(let j=0; j<MAP_SIZE.y; ++j){
        voxels.setVoxelId(i, MAP_ZINDEX+4, j, 0);
      }
    }
    awa.forEach((a, x) => {
      a.forEach((v, y) => {
        if(v === 255) voxels.setVoxelId(x, MAP_ZINDEX+4, y, 235);
        else if(v !== 0) voxels.setVoxelId(x, MAP_ZINDEX+4, y, Teams[v].voxel);
      })
    })
  }
}