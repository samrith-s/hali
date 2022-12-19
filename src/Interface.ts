export namespace Hali {
  export interface Store {}

  export enum EventTypes {
    STATE_UPDATE = "state-update",
    DISPATCH = "dispatch",
  }

  export type EventListener<T = any> = (data?: T) => void;

  export type EventHandler = {
    remove(): void;
  };
}
