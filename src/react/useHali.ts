import { useContext, useEffect, useRef, useState } from "react";
import { Hali } from "../Interface";
import { HaliContext } from "./HaliContext";

export function useHali<State = any>(selector: Hali.Selector<State>) {
  const store = useContext(HaliContext);
  const previousValue = useRef(null);
  const [value, setValue] = useState(selector(store.getState()));

  useEffect(() => {
    const listener = store.on(Hali.EventTypes.STATE_UPDATE, (data) => {
      const newValue = selector(data);
      let isShallowDifferent = false;
      if (typeof newValue === "object" && newValue !== null) {
        Object.keys(newValue).some(
          (key) =>
            (newValue as any)[key] !== (previousValue.current as any)[key]
        );
      }

      if (newValue !== previousValue.current) {
        setValue(newValue as any);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return value;
}

const MyStore = {
  x: {
    a: 200,
  },
  y: {
    b: "lol",
  },
};

const value = useHali<typeof MyStore>((state) => state.x);
