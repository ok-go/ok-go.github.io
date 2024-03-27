interface InfoLineProps {
  total: number
  shotCount: number
  removeItem: () => void
  done: () => void
}

export function InfoLine(props: InfoLineProps) {
  let avg = (props.total / props.shotCount)
  if (isNaN(avg)) {
    avg = 0
  }

  return (
    <div class='infoline'>
      <div class='btn' onClick={props.done}>DONE</div>
      <div class='scoretotal'>TOTAL: {props.total}</div>
      <div class='scoretotal'>AVG: {avg.toFixed(2)}</div>
      <div class='btn' onClick={props.removeItem}>{'<-'}</div>
    </div>
  )
}
