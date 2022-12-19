import { HaliEventEmitter } from "./EventEmitter";
import { Hali } from "./interface";

export class Store {
  private readonly emitter = new HaliEventEmitter();

  private readonly store: Hali.Store = {};

  constructor() {}
}
