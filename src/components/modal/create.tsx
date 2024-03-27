import './modal.css'
import { useCallback, useContext, useRef } from "react";
import { IDBContext } from "../../context";
import { Modal } from "./modal";

export function ModalCreate(props: { onDone: (create: boolean) => void }) {
  const idb = useContext(IDBContext)
  const refs = {
    rounds: useRef<HTMLInputElement | null>(null),
    sets: useRef<HTMLInputElement | null>(null),
    arrows: useRef<HTMLInputElement | null>(null),
    date: useRef<HTMLInputElement | null>(null),
    desc: useRef<HTMLTextAreaElement | null>(null),
  }

  const onSubmit = useCallback(async (ev: SubmitEvent) => {
    ev.preventDefault()
    const r = refs.rounds.current ? parseInt(refs.rounds.current.value) : 2
    const s = refs.sets.current ? parseInt(refs.sets.current.value) : 10
    await idb.add({
      desc: refs.desc.current?.value,
      happensAt: refs.date.current ? new Date(refs.date.current.value) : new Date(),
      rounds: r,
      setsPerRound: s,
      shotsPerSet: refs.arrows.current ? parseInt(refs.arrows.current.value) : 3,
      total: 0,
      avg: 0,
      sets: Array.from({length: r * s}, () => [])
    })
    props.onDone(true)
  }, [idb, refs])

  return (
    <Modal onClickOut={() => props.onDone(false)}>
      <form class='modal-form' onSubmit={onSubmit}>
        <div style='font-weight: bold; text-align: center;'>
          Create session
        </div>
        <hr class='h1' />
        <div class='row'>
          <label>Rounds</label>
          <input ref={refs.rounds} inputMode='numeric' size={4} value={2} pattern='[1-9][0-9]*' />
        </div>
        <div class='row'>
          <label>Sets per round</label>
          <input ref={refs.sets} inputMode='numeric' size={4} value={10} pattern='[1-9][0-9]*' />
        </div>
        <div class='row'>
          <label>Arrows per set</label>
          <input ref={refs.arrows} inputMode='numeric' size={4} value={3} pattern='[1-9][0-9]*' />
        </div>
        <div class='row'>
          <label>Date</label>
          <input ref={refs.date} type='date' value={(new Date()).toISOString().split('T')[0]} />
        </div>
        <textarea ref={refs.desc} rows={2} maxLength={100} placeholder={'Description'}></textarea>
        <hr class='h1' />
        <input class='submit' type='submit' value='Create' />
      </form>
    </Modal>
  )
}
