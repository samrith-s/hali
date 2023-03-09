import { HaliEventEmitter } from "./EventEmitter";
import { Hali } from "./Interface";

export class HaliStore<State = any> extends HaliEventEmitter<State> {
  private readonly cases: Map<any, Hali.Case<State, any>> = new Map();
  private state: State;
  private executed: Hali.ExecutedMeta<State> = {
    list: [],
    state(executed) {
      this.list.push({
        type: Hali.ExecutionType.STATE,
        ...executed,
      });
    },
    action(executed) {
      this.list.push({
        type: Hali.ExecutionType.ACTION,
        ...executed,
      });
    },
    effect(executed) {
      this.list.push({
        type: Hali.ExecutionType.EFFECT,
        ...executed,
      });
    },
  };

  constructor(state: State, cases?: Map<any, Hali.Case<State, any>>) {
    super();
    this.state = state;

    if (cases) {
      this.cases = cases;
    }
  }

  protected setState(state: Partial<State> | void) {
    const newState = {
      ...this.state,
      ...state,
    };
    this.state = newState;
    this.emit(Hali.EventTypes.STATE_UPDATE, newState);
    return newState;
  }

  protected builder<Type, Payload>(
    action: Hali.DispatchAction<Type, Payload>
  ): Hali.Builder<State, Payload> {
    const $this = this;

    return {
      setState(state) {
        let newState: Partial<State>;

        if (typeof state === "function") {
          newState = state({ state: $this.state, payload: action.payload });
        } else {
          newState = state;
        }

        const previousState = { ...this.state };
        const nextState = $this.setState(newState);

        $this.executed.state({
          name: action.type as unknown as string,
          previousState,
          nextState,
        });

        $this.setState(newState);
        return this;
      },
      state: this.state,
      payload: action.payload,
      dispatch(actionToDispatch: Hali.DispatchAction<any, any>) {
        $this.dispatch(
          {
            name: action.type,
            type: Hali.ExecutionType.ACTION,
          },
          actionToDispatch
        );
        return this;
      },
    };
  }

  public getState() {
    return this.state;
  }

  public getCases() {
    return this.cases;
  }

  // public dispatch = <Type, Payload>(
  //   action: Hali.DispatchAction<Type, Payload>
  // ) => {
  //   this.executed.dispatch({
  //     name: action.type as unknown as string,
  //     payload: action.payload,
  //     source: {
  //       name: "store",
  //       type: Hali.ExecutionType.DISPATCH,
  //     },
  //   });
  //   this._dispatch(null, action);
  // };

  private dispatch = <Type, Payload>(
    source: Hali.DispatchSource | null,
    action: Hali.DispatchAction<Type, Payload>
  ) => {
    const actionCase = this.cases.get(action.type);
    if (actionCase) {
      actionCase(
        this.builder<typeof action.type, Hali.ActionPayload<typeof action>>(
          action
        )
      );
      if (source !== null) {
        this.executed.action({
          name: action.type as unknown as string,
          payload: action.payload,
          source,
        });
      }
    } else {
      throw new Error(
        `No action for case: "${action.type}". Please add a case to the store.`
      );
    }
  };

  public action = <Payload = never>(type: string) => {
    const createdAction = (payload: Payload) => {
      let newPayload: any;

      if (typeof payload === "function") {
        newPayload = payload(this.state);
      } else {
        newPayload = payload;
      }

      const dispatchAction = {
        type,
        payload: newPayload,
      } as Hali.DispatchAction<typeof type, Payload>;

      return dispatchAction;
    };

    createdAction.type = type;
    return createdAction as Hali.ActionType<typeof type, Payload>;
  };

  public effect = <Payload>(
    name: string,
    effect: Hali.Effect<State, Payload>
  ) => {
    const $this = this;
    return function CreatedEffect(payload?: Payload) {
      $this.executed.effect({
        name,
        payload,
      });

      effect({
        payload: payload as Payload,
        state: $this.state,
        dispatch: $this.dispatch.bind($this, {
          name,
          type: Hali.ExecutionType.EFFECT,
        }) as Hali.Dispatch<Hali.ExecutionType.EFFECT, Payload>,
      });
    };
  };

  public case = <Action>(
    action: Action,
    effect: Hali.Case<State, Hali.ActionPayload<Action>>
  ) => {
    this.cases.set((action as any).type, effect);
    return this as Omit<typeof this, "">;
  };

  public combine = <StoreType extends HaliStore<any>>(
    store: StoreType,
    override = true
  ) => {
    const newState = {
      ...this.getState(),
      ...store.getState(),
    };

    const newCases = new Map();

    this.getCases().forEach((effect, type) => {
      newCases.set(type, effect);
    });

    if (override) {
      store.getCases().forEach((effect, type) => {
        newCases.set(type, effect);
      });
    }

    return new HaliStore(
      newState,
      newCases as Map<any, Hali.Case<typeof newState, any>>
    );
  };

  public getExecutions = () => {
    return this.executed.list;
  };
}
