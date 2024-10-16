import Component from "component";
import { KEnclose } from "@/Model/Enclose";
import { Emit } from "@/Event";
import { KEvents, WEATHER_CHANGE_TIME } from "@/Constants";
import { KTeamManager } from "./TeamManager";
import { Rich } from "@/lib/Rich";
import { Listener } from "@/lib/Emitter";
import { KZoneMgr } from "./ZoneManager";

export class KGameUpdater extends Component {
  model: KEnclose;
  tick: number;
  teamMgr: KTeamManager;
  zoneMgr: KZoneMgr;
  voxelContactListener: Listener | null;

  constructor(){
    super();
    this.model = new KEnclose();
    this.tick = 0;
    this.teamMgr = new KTeamManager();
    this.zoneMgr = new KZoneMgr();
    this.voxelContactListener = null;
  }

  changeWeather(){
    this.zoneMgr.init();
  }

  protected onEnable(): void {
    if(this.enableCount <= 1) return;
    world.say("Game Start");
    this.tick = 0;
    this.model.init();
    this.teamMgr.clear();
    this.teamMgr.alloc();
    this.zoneMgr.init();
    this.voxelContactListener = Emit.on(KEvents.VoxelContact, (x, y, team) => {
      this.model.setVoxel(x, y, team);
    });
  }

  protected onDisable(): void {
    world.say("Game end.");
    this.model.clear();
    this.teamMgr.clear();
    this.zoneMgr.clear();
    this.voxelContactListener?.cancel();
    this.voxelContactListener = null;
  }

  protected onUpdate(deltaTime: number): void {    
    this.model.updateModel(this.teamMgr.teamNum);
    this.zoneMgr.calcEffect(this.model);
    this.model.updateMap();

    this.tick += deltaTime;
    if(this.tick / 1000 <= WEATHER_CHANGE_TIME){
      return;
    }
    this.changeWeather();
    this.tick = 0;
  }
}