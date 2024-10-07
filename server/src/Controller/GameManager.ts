import Component from "component";
import { KGameUpdater } from "./GameUpdater";
import { GAME_REST_TIME, GAME_TIME } from "../Constants";

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
    this.tick = 30000;
    this.state = KGameState.REST;
    this.nextStateChangeTime = GAME_REST_TIME;
    this.updater = new KGameUpdater();
    this.updater.enable = false;
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