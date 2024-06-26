import { describe, expect, it, vi } from "vitest";

import { Action, BaseDispatcher, Dispatcher } from "../Dispatchers";
import { Store } from "../Store";

class Dummy extends BaseDispatcher<Dispatcher.ACTION, unknown> {}

describe("handlers", () => {
  it("should warn if an handler is already registered with the same name ", () => {
    const mockConsole = vi.spyOn(console, "warn");
    const store = new Store(10);

    store.action("increment", vi.fn());
    store.action("increment", vi.fn());

    expect(mockConsole).toHaveBeenCalled();

    mockConsole.mockReset();
  });

  it("should throw an error if an handler does not exist", () => {
    const store = new Store(10);

    expect(() =>
      store.dispatch(
        new Dummy({
          displayName: "hello",
          type: "hi" as Dispatcher,
        }) as Action<number, never>
      )
    ).toThrowError(TypeError);
  });
});
