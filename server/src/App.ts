import Component, { componentObjByUuid } from "component";
import { Player } from "./Player";
import { KGameManager } from "./GameManager";
import { Rich } from "./lib/Rich";

export class App extends Component {
  protected onStart(): void {
    world.onPlayerJoin(({entity}) => {this.onPlyaerJoin(entity)});
    world.onPlayerLeave(({entity}) => {this.onPlayerLeave(entity)});
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
const app = new App();

