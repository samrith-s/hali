import { Hali } from "./interface";

export class HaliEventEmitter {
  private eventsMap: Record<Hali.EventTypes, Hali.EventListener[]> =
    Object.values(Hali.EventTypes).reduce(
      (acc, event) => ({
        ...acc,
        [event]: [],
      }),
      {} as any
    );

  emit<T = any>(event: Hali.EventTypes, data?: T) {
    this.eventsMap[event].forEach((listener) => listener(data));
  }

  on<T = any>(
    event: Hali.EventTypes,
    listener: Hali.EventListener<T>
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
