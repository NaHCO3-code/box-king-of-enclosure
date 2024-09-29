import Component, { componentObjByUuid } from "component";
import { Player } from "./Player";
import { KGameManager } from "./GameManager";
import { Rich } from "./lib/Rich";
import { KCommand } from "./Command";

export class App extends Component {
  protected onStart(): void {
    world.onPlayerJoin(({entity}) => {this.onPlyaerJoin(entity)});
    world.onPlayerLeave(({entity}) => {this.onPlayerLeave(entity)});

    world.addZone({
      bounds: {
        lo: new GameVector3(0, 0, 0),
        hi: new GameVector3(10, 64, 10)
      } as GameBounds3,
      rainEnabled: true,
    });

    world.addZone({
      bounds: {
        lo: new GameVector3(0, 0, 0),
        hi: new GameVector3(5, 64, 5)
      } as GameBounds3,
      rainEnabled: false,
      snowEnabled: true
    });
  }

  protected onUpdate(dt: number): void {

  }
  
  onPlyaerJoin(entity: GamePlayerEntity){
    Player.create(entity);
    gameMgr.startGame(); // 测试用的
  }

  onPlayerLeave(entity: GamePlayerEntity){
    Player.delete(entity);
  }
}

const gameMgr = new KGameManager();
const cmd = new KCommand(gameMgr);
const app = new App();

