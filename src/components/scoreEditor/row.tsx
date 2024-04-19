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
  selectedRound?: number
  setsPerRound: number
  isDarker: boolean
}

export function Row(props: RowProps) {
  const sum = props.data.reduce((agg, v) => agg + codeToValue(v.code), 0)
  const tail = Array.from({length: props.maxSize - props.data.length}, () => ({code: '\u00A0'}) as ShotInfo)
  const isRowItemDarker = (i: number) => {
    return props.isDarker || props.selectedColumn !== undefined && i !== props.selectedColumn
  }
  const renderRows = (data: ShotInfo[]) => data.map((v, i) => {
    return <RowItem value={v.code} darker={isRowItemDarker(i)} />
  })

  return (
    <div className={`scorerow ${props.selected ? 'selected' : ''}`} onClick={() => props.select(props.num - 1)}>
      <RowItem value={`#${props.num}`} darker={false} />
      {renderRows(props.data)}
      {renderRows(tail)}
      <RowItem value={sum} darker={false} />
    </div>
  )
}
