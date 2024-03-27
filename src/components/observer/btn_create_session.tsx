import './observer.css'
import { useSignal } from "@preact/signals";
import { ModalCreate } from "../modal/create";

export function BtnCreateSession(props: { onCreate: () => void }) {
  const openModal = useSignal(false)

  return (
    <>
      <span className='btn-create-session' onClick={() => openModal.value = true}></span>
      {
        openModal.value && <ModalCreate onDone={(create) => {
          openModal.value = false
          if (create) {
            props.onCreate()
          }
        }} />
      }
    </>
  )
}
