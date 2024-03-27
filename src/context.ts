import { createContext } from "preact";
import { IDB } from "./idb/idb";

export const IDBContext = createContext(new IDB())
