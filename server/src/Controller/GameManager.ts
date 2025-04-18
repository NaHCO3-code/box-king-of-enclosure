import Component from "../Component/Definition";
import { KGameUpdater } from "./GameUpdater";
import { GAME_REST_TIME, GAME_TIME } from "@/Constants";
import { Rich } from "@/lib/Rich";

export enum KGameState {
  GAME,
  REST
}

export class KGameManager extends Component {
  updater: KGameUpdater;
  state: KGameState;
  nextStateChangeTime: number;
  tick: number;

  constructor(){
    super();
    this.tick = 0;
    this.state = KGameState.REST;
    this.nextStateChangeTime = GAME_REST_TIME;
    this.updater = new KGameUpdater();
    this.updater.enable = false;
    setInterval(() => {
      world.say(`距离${this.state === KGameState.REST ? "游戏开始" : "游戏结束"}还有${this.nextStateChangeTime - Math.floor(this.tick / 1000)}秒`);
    }, 3000);
  }

  toGame(){
    this.state = KGameState.GAME;
    this.nextStateChangeTime = GAME_TIME;
    this.updater.enable = true;
  }

  toRest(){
    this.state = KGameState.REST;
    this.nextStateChangeTime = GAME_REST_TIME;
    this.updater.enable = false;
  }

  protected onUpdate(deltaTime: number): void {
    this.tick += deltaTime;
    if(this.tick / 1000 <= this.nextStateChangeTime){
      return;
    }
    if(this.state === KGameState.REST){
      this.toGame();
    }else{
      this.toRest();
    }
    this.tick = 0;
  }
}