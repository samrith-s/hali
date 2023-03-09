export namespace Hali {
  export interface Store {}

  /**
   * Events
   */
  export enum EventTypes {
    STATE_UPDATE = "state-update",
    DISPATCH = "dispatch",
  }

  export type EventListener<T = any> = (state?: T) => void;

  export type EventHandler = {
    remove(): void;
  };

  /**
   * State
   */
  export type StateSetterParams<State, Payload> = {
    state: State;
    payload: Payload;
  };

  export type StateSetter<State, Payload> =
    | Partial<State>
    | (({
        state,
        payload,
      }: StateSetterParams<State, Payload>) => Partial<State>)
    | (({
        state,
      }: Pick<StateSetterParams<State, Payload>, "state">) => Partial<State>)
    | (({
        payload,
      }: Pick<StateSetterParams<State, Payload>, "payload">) => Partial<State>)
    | (() => Partial<State>);

  /**
   * Dispatch
   */
  export type Dispatch<Type extends ExecutionType, Payload> = (
    action: DispatchAction<Type, Payload>
  ) => void;

  export type DispatchSource = {
    name: any;
    type: ExecutionType;
  };

  export type DispatchAction<Type, Payload> = {
    type: Type;
    payload: Payload;
  };

  /**
   * Action
   */
  export type ActionType<Type, Payload> = {
    (
      payload?: Payload extends Function | never ? never : Payload
    ): DispatchAction<Type, Payload>;
    type: Type;
  };

  // @ts-ignore
  export type ActionPayload<Action> = ReturnType<Action>["payload"];

  /**
   * Effect
   */
  export type Effector<State, Payload> = {
    payload: Payload;
    state: State;
    dispatch: Dispatch<any, Payload>;
  };

  export type Effect<State, Payload> = (
    props: Effector<State, Payload>
  ) => void;

  export type EffectDispatch<Payload, Type extends ExecutionType> = (
    action: DispatchAction<Type, Payload>
  ) => void;

  /**
   * Builder
   */
  export type Builder<State, Payload> = {
    state: State;
    payload: Payload;
    setState(state: StateSetter<State, Payload>): Builder<State, Payload>;
    dispatch(action: DispatchAction<any, any>): Builder<State, Payload>;
  };

  /**
   * Case
   */
  export type Case<State, Payload> = (builder: Builder<State, Payload>) => void;

  /**
   * Selector
   */
  export type Selector<State> = <Value = Partial<State>>(state: State) => Value;

  /**
   * Execution
   */
  export enum ExecutionType {
    ACTION = "action",
    EFFECT = "effect",
    STATE = "state",
    DISPATCH = "dispatch",
  }

  export type ExecutedAction = {
    type: ExecutionType.ACTION;
    name: string;
    source: DispatchSource;
    payload: any;
  };

  export type ExecutedEffect = {
    type: ExecutionType.EFFECT;
    name: string;
    payload: any;
  };

  export type ExecutedState<State> = {
    type: ExecutionType.STATE;
    name: string;
    previousState: State;
    nextState: State;
  };

  export type ExecutedDispatch = {
    type: ExecutionType.DISPATCH;
    name: string;
    payload: any;
    source: DispatchSource;
  };

  export type Executed<State> =
    | ExecutedAction
    | ExecutedEffect
    | ExecutedState<State>
    | ExecutedDispatch;

  export type ExecutedMeta<State> = {
    list: Executed<State>[];
    state(executed: Omit<ExecutedState<State>, "type">): void;
    action(executed: Omit<ExecutedAction, "type">): void;
    effect(executed: Omit<ExecutedEffect, "type">): void;
  };
}
