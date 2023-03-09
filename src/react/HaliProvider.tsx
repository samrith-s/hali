import { ReactNode } from "react";
import { HaliStore } from "../Store";
import { HaliContext } from "./HaliContext";

export type HaliProviderProps<Store extends HaliStore<any>> = {
  store: Store;
  children: ReactNode;
};

export function HaliProvider<Store extends HaliStore<any>>({
  store,
  children,
}: HaliProviderProps<Store>) {
  return <HaliContext.Provider value={store}>{children}</HaliContext.Provider>;
}
