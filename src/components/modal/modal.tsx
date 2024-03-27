import './modal.css'
import { VNode } from "preact";
import { createPortal, useCallback, useRef } from "react";

export function Modal(props: { children: VNode, onClickOut?: () => void }) {
  const overflow = useRef<HTMLDivElement | null>(null)
  const onClickOut = useCallback((e: UIEvent) => {
    if (e.target === overflow.current && props.onClickOut) {
      props.onClickOut()
    }
  }, [props.onClickOut])

  const modalContainer = document.getElementById('body')
  return modalContainer && createPortal(
    <div ref={overflow} class='modal-overflow' onClick={onClickOut}>
      <div className='modal'>{props.children}</div>
    </div>,
    modalContainer
  )
}
