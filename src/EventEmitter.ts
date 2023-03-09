import { Hali } from "./Interface";

export class HaliEventEmitter<State = any> {
  private eventsMap: Record<Hali.EventTypes, Hali.EventListener[]> =
    Object.values(Hali.EventTypes).reduce(
      (acc, event) => ({
        ...acc,
        [event]: [],
      }),
      {} as any
    );

  emit<State>(event: Hali.EventTypes, data: State) {
    this.eventsMap[event].forEach((listener) => listener(data));
  }

  on(
    event: Hali.EventTypes,
    listener: Hali.EventListener<State>
  ): Hali.EventHandler {
    this.eventsMap[event].push(listener);

    return {
      remove: () => {
        this.eventsMap[event] = this.eventsMap[event].filter(
          (currentListener) => currentListener !== listener
        );
      },
    };
  }
}
