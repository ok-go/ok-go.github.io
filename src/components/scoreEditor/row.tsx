import { codeToValue } from "./targetFace";
import { RowItem } from "./rowitem";
import { ShotInfo } from "../../imodels/session";

interface RowProps {
  selected: boolean
  num: number
  data: ShotInfo[]
  maxSize: number
  select: (i: number) => void
  selectedColumn?: number
}

export function Row(props: RowProps) {
  const sum = props.data.reduce((agg, v) => agg + codeToValue(v.code), 0)
  const tail = Array.from({length: props.maxSize - props.data.length})
  const isDarker = (i: number) => {
    return props.selectedColumn !== undefined && i !== props.selectedColumn
  }

  return (
    <div className={`scorerow ${props.selected ? 'selected' : ''}`} onClick={() => props.select(props.num - 1)}>
      <RowItem value={`#${props.num}`} darker={isDarker(-1)} />
      {props.data.map((v, i) => <RowItem value={v.code} darker={isDarker(i)} />)}
      {tail.map((_, i) => <RowItem value={'\u00A0'} darker={isDarker(i + props.data.length)} />)}
      <RowItem value={sum} darker={isDarker(-1)} />
    </div>
  )
}
