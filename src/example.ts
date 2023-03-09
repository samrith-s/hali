import { HaliStore } from "./Store";

const store = new HaliStore({
  count: 0,
});

const increment = store.action<number>("increment");

store.case(increment, async ({ state, payload, setState }) => {
  setState({ count: payload + state.count });
});

increment(10);

const effect = store.effect("get data", () => {
  setTimeout(() => {
    increment(10);
  }, 100);
});

effect();

store.getExecutions();
