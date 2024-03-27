import './modal.css'
import { Session } from "../../imodels/session";
import { useContext, useRef } from "react";
import { IDBContext } from "../../context";
import { Modal } from "./modal";

export function ModalEdit({session, onEditDone}: { session: Session, onEditDone: () => void }) {
  const idb = useContext(IDBContext)
  const date = useRef<HTMLInputElement | null>(null)
  const desc = useRef<HTMLTextAreaElement | null>(null)

  return (
    <Modal onClickOut={onEditDone}>
      <form class='modal-form' onSubmit={async (e: SubmitEvent) => {
        e.preventDefault()
        session.desc = desc.current ? desc.current.value : session.desc
        session.happensAt = date.current ? new Date(date.current.value) : session.happensAt
        await idb.set(session)
        onEditDone()
      }}>
        <div style='font-weight: bold; text-align: center;'>
          Edit session
        </div>
        <hr className='h1' />
        <div className='row'>
          <label>Date</label>
          <input ref={date} type='date' value={(new Date()).toISOString().split('T')[0]} />
        </div>
        <textarea ref={desc} rows={2} maxLength={100} placeholder={'Description'}></textarea>
        <hr className='h1' />
        <input class='submit' type='submit' value='Save' />
      </form>
    </Modal>
  )
}
