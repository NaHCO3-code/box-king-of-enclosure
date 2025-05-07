import Component from "@/Component/Definition";
import { KEnclose } from "@/Model/Enclose";
import { Event } from "@/Event";
import { KEvents, WEATHER_CHANGE_TIME } from "@/Constants";
import { KTeamManager } from "./TeamManager";
import { Listener } from "@/lib/Emitter";
import { KZoneMgr } from "./ZoneManager";
import { RemoteEvent } from "@shares/RemoteEvent";
import { PlayerManager } from "@/Controller/PlayerManager";

/**
 * 游戏更新器
 */
export class KGameUpdater extends Component {
  model: KEnclose;
  tick: number;
  teamMgr: KTeamManager;
  zoneMgr: KZoneMgr;
  voxelContactListener: Listener | null;

  constructor() {
    super();
    this.model = new KEnclose();
    this.tick = 0;
    this.teamMgr = new KTeamManager();
    this.zoneMgr = new KZoneMgr();
    this.voxelContactListener = null;
  }

  changeWeather() {
    world.say("天气切换！");
    this.zoneMgr.init();
  }

  protected onEnable(): void {
    if (this.enableCount <= 1) return;
    world.say("游戏开始");
    this.tick = 0;
    this.model.init();
    this.teamMgr.clear();
    this.teamMgr.alloc();
    this.zoneMgr.init();
    this.voxelContactListener = Event.on(KEvents.VoxelContact, (x, y, team) => {
      this.model.setVoxel(x, y, team);
    });
  }

  protected onDisable(): void {
    const result = this.model.getStat();
    remoteChannel.sendClientEvent(
      Array.from(PlayerManager.instance.players.values()).map(
        (player) => player.entity
      ),
      {
        type: RemoteEvent.gameinfo,
        args: {
          gameInfo: result,
        },
      }
    );
    world.say("游戏结束");
    this.model.clear();
    this.teamMgr.clear();
    this.zoneMgr.clear();
    this.voxelContactListener?.cancel();
    this.voxelContactListener = null;
  }

  protected onUpdate(deltaTime: number): void {
    this.model.updateModel(this.teamMgr.teamCount);
    this.zoneMgr.calcEffect(this.model);
    this.model.updateMap();
    this.tick += deltaTime;
    if (this.tick / 1000 <= WEATHER_CHANGE_TIME) {
      return;
    }
    this.changeWeather();
    this.tick = 0;
  }
}
