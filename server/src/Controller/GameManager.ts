import Component from "../Component/Definition";
import { KGameUpdater } from "./GameUpdater";
import {
  GAME_REST_TIME,
  GAME_TIME,
  KGameAction,
  KGameState,
} from "@/Constants";
import { StateMachine, StateMachineConfig } from "@/lib/StateMachine";

interface KGameContext {
  updater: KGameUpdater;
  tick: number;
  nextStateChangeTime: number;
}

const config: StateMachineConfig<KGameContext, KGameState, KGameAction> = {
  [KGameState.REST]: {
    enter: (context) => {
      context.updater.enable = false;
      context.nextStateChangeTime = GAME_REST_TIME;
      context.tick = 0;
    },
    transitions: {
      [KGameAction.START_GAME]: {
        target: KGameState.GAME,
      },
    },
  },
  [KGameState.GAME]: {
    enter: (context) => {
      context.updater.enable = true;
      context.nextStateChangeTime = GAME_TIME;
      context.tick = 0;
    },
    transitions: {
      [KGameAction.END_GAME]: {
        target: KGameState.REST,
      },
    },
  },
};

/**
 * 游戏状态管理器
 */
export class KGameManager extends Component {
  private context = {
    updater: new KGameUpdater(),
    tick: 0,
    nextStateChangeTime: GAME_REST_TIME,
  };

  private stateMachine = new StateMachine(
    this.context,
    config,
    KGameState.REST
  );

  constructor() {
    super();

    this.context.updater.enable = false;

    setInterval(() => {
      const currentState = this.getCurrentState();
      world.say(
        `距离${currentState === KGameState.REST ? "游戏开始" : "游戏结束"}还有${
          this.context.nextStateChangeTime -
          Math.floor(this.context.tick / 1000)
        }秒`
      );
    }, 3000);
  }

  getCurrentState(): KGameState {
    return this.context.updater.enable ? KGameState.GAME : KGameState.REST;
  }

  protected onUpdate(deltaTime: number): void {
    this.context.tick += deltaTime;
    if (this.context.tick / 1000 <= this.context.nextStateChangeTime) {
      return;
    }

    const currentState = this.getCurrentState();
    if (currentState === KGameState.REST) {
      this.stateMachine.handleAction(KGameAction.START_GAME);
    } else {
      this.stateMachine.handleAction(KGameAction.END_GAME);
    }
  }
}
