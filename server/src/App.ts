import Component from "component";
import { Player } from "./Player";
import { KGameManager } from "./GameManager";

export class App extends Component {
  protected onStart(): void {
    world.onPlayerJoin(({entity}) => {this.onPlyaerJoin(entity)});
    world.onPlayerLeave(({entity}) => {this.onPlayerLeave(entity)});
  }

  protected onUpdate(dt: number): void {

  }
  
  onPlyaerJoin(entity: GamePlayerEntity){
    Player.create(entity);
  }

  onPlayerLeave(entity: GamePlayerEntity){
    Player.delete(entity);
  }
}

const gameMgr = new KGameManager();
// const cmd = new KCommand(gameMgr);
const app = new App();
