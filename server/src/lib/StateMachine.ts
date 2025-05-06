type StateTransitions<Context, State extends string, Action extends string> = {
  [action in Action]?: {
    target: State;
    condition?: (context: Context) => boolean;
    action?: (context: Context) => void;
  };
};

export type StateMachineConfig<
  Context,
  State extends string,
  Action extends string,
> = {
  [state in State]?: {
    enter?(context: Context): void;
    exit?(context: Context): void;
    transitions: StateTransitions<Context, State, Action>;
  };
};

export class StateMachine<
  Context,
  State extends string,
  Action extends string,
  Config extends StateMachineConfig<Context, State, Action>,
> {
  private currentState: Config[keyof Config] | undefined;
  private states: Map<keyof Config, Config[keyof Config]> = new Map();
  private context: Context;

  constructor(context: Context, config: Config, entry: keyof Config) {
    this.context = context;
    this.currentState = config[entry];
    for (const s in config) {
      this.states.set(s, config[s]);
    }
    this.currentState?.enter?.(context);
  }

  handleAction(action: Action) {
    if (!this.currentState) return;

    const transition = this.currentState.transitions[action];
    if (!transition) return;

    const { target, condition, action: transitionAction } = transition;
    if (condition && !condition(this.context)) return;

    this.currentState.exit?.(this.context);
    this.currentState = this.states.get(target)!;
    this.currentState.enter?.(this.context);

    transitionAction?.(this.context);
  }
}
