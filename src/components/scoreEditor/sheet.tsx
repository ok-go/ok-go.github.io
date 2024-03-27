import { Row } from "./row";
import { RowItem } from "./rowitem";
import { ShotInfo } from "../../imodels/session";

interface SheetProps {
  roundCount: number
  setsPerRound: number
  arrowsPerSet: number
  sets: ShotInfo[][]

  selected?: number
  select: (i: number) => void
  selectedColumn: number | undefined
  selectColumn: (i: number) => void
}

export function Sheet(props: SheetProps) {
  const {sets, setsPerRound, roundCount, arrowsPerSet, select, selected, selectedColumn, selectColumn} = props
  const header = Array.from({length: arrowsPerSet})
  const isDarker = (i: number) => {
    return props.selectedColumn !== undefined && i !== props.selectedColumn
  }

  const rows = []
  for (let i = 0; i < setsPerRound * roundCount; i++) {
    if (i > 0 && i % setsPerRound === 0) {
      rows.push(<hr class='h1' />)
    }
    rows.push(<Row maxSize={arrowsPerSet}
                   selected={i === selected}
                   selectedColumn={selectedColumn}
                   num={i + 1}
                   select={select}
                   data={sets[i]} />)
  }

  return (
    <div class='sheets'>
      <div class='sheets-header'>
        <div className='scorerow'>
          <RowItem value='SET' darker={isDarker(-1)} />
          {header.map((_, i) =>
            <RowItem value={`#${i + 1}`} darker={isDarker(i)} onClick={() => selectColumn(i)} />)}
          <RowItem value='SUM' darker={isDarker(-1)} />
        </div>
      </div>
      <div class='sheets-body'>
        {rows}
      </div>
    </div>
  )
}

