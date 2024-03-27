import './observer.css'
import { useCallback, useContext, useEffect, useState } from "react";
import { Session } from "../../imodels/session";
import { IDBContext } from "../../context";
import { ModalEdit } from "../modal/edit";
import { BtnCreateSession } from "./btn_create_session";
import { Credentials } from "../credentials/credentials";

export function Observer(props: { select: (s: Session) => void }) {
  const idb = useContext(IDBContext)
  const [sessions, setSessions] = useState<Session[]>([])
  const [toEdit, setToEdit] = useState<Session | undefined>(undefined)
  const loadSessions = useCallback(() => {
    idb.getSessions().then((sx) => setSessions(sx))
  }, [idb, setSessions])

  useEffect(() => loadSessions(), [loadSessions])

  const remove = useCallback(async (s: Session) => {
    if (confirm('Delete this session?')) {
      await idb.del(s)
      const ind = sessions.findIndex((v) => v.id === s.id)
      setSessions([...sessions.slice(0, ind), ...sessions.slice(ind + 1)])
    }
  }, [idb, sessions, setSessions])

  const onEditDone = useCallback(async () => {
    setToEdit(undefined)
    loadSessions()
  }, [loadSessions, setToEdit])

  return (
    <div class='observer'>
      <List sessions={sessions} onClick={props.select} remove={remove} edit={setToEdit} />
      {toEdit && <ModalEdit session={toEdit} onEditDone={onEditDone} />}
      <BtnCreateSession onCreate={loadSessions} />
      <Credentials withLogo={sessions.length === 0} />
    </div>
  )
}

interface ListProps {
  sessions: Session[],
  onClick: (s: Session) => void,
  remove: (s: Session) => void,
  edit: (s: Session) => void
}

function List({sessions, onClick, remove, edit}: ListProps) {
  return <div class='list'>
    {sessions.map((s) => {
      return <>
        <Item key={s.id} s={s} onClick={() => onClick(s)} remove={() => remove(s)} edit={() => edit(s)} />
        <hr className='h1' />
      </>
    })}
  </div>
}

function Item(props: { s: Session, onClick: () => void, remove: () => void, edit: () => void }) {
  const remove = useCallback((e: UIEvent) => {
    props.remove()
    e.stopPropagation()
  }, [props.remove])
  const edit = useCallback((e: UIEvent) => {
    props.edit()
    e.stopPropagation()
  }, [props.edit])

  return (
    <div class='item' onClick={props.onClick}>
      <div style='align-items: center; display: grid; grid-template-columns: 1fr 3fr 40px 30px; gap: 1em;'>
        <div style='display: flex; flex-direction: column; justify-content: space-between'>
          <div style='display: flex; flex-direction: column; text-align: center;'>
            <div style='font-size: x-large;'>{props.s.total}</div>
            <div style='filter: brightness(75%); font-size: smaller;'>Avg:&nbsp;{props.s.avg.toFixed(2)}</div>
          </div>
        </div>
        <div style='display: flex; flex-direction: column; justify-content: center; align-items: flex-start;'>
          <div>{props.s.happensAt.toLocaleDateString()}</div>
          <div style='filter: brightness(75%); font-size: smaller;'>{props.s.desc}</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none"
             onClick={edit}>
          <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H9M15 5H17C18.1046 5 19 5.89543 19 7V9"
                stroke="rgba(255, 255, 255, 0.67)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M14.902 20.3343L12.7153 20.7716L13.1526 18.585C13.1914 18.3914 13.2865 18.2136 13.4261 18.074L17.5 14L19.5 12L21.4869 13.9869L19.4869 15.9869L15.413 20.0608C15.2734 20.2004 15.0956 20.2956 14.902 20.3343Z"
            stroke="rgba(255, 255, 255, 0.67)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="rgba(255, 255, 255, 0.67)"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 0.67)" width="30px" height="30px"
             viewBox="-6.7 0 122.88 122.88" onClick={remove}>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z" />
        </svg>
      </div>
    </div>
  )
}
