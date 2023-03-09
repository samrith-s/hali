import { createContext } from "react";
import { Store } from "../";

export const HaliContext = createContext<Store>(new Store({}));
