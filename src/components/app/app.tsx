import './app.css'
import { ScoreEditor } from "../scoreEditor/scoreEditor";
import { useContext, useState } from "react";
import { Session } from "../../imodels/session";
import { Observer } from "../observer/observer";
import { IDBContext } from "../../context";

export function App() {
  const idb = useContext(IDBContext)

  const [session, selectSession] = useState<undefined | Session>(undefined)
  const saveSession = (session: Session, changed: boolean) => {
    if (!changed) {
      selectSession(undefined)
      return
    }
    if (confirm('Save before exit?')) {
      idb.set(session).catch(reason => console.error(`failed save session: ${reason}`))
    }
    selectSession(undefined)
  }

  return session === undefined
    ? <Observer select={(s) => selectSession(s)} />
    : <ScoreEditor session={session} done={saveSession} />
}
