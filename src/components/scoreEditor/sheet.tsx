import { Row } from "./row";
import { RowItem } from "./rowitem";
import { ShotInfo } from "../../imodels/session";
import { codeToValue } from "./targetFace";
import { useCallback } from "react";

interface SheetProps {
  roundCount: number
  setsPerRound: number
  arrowsPerSet: number
  sets: ShotInfo[][]

  selected?: number
  select: (i: number) => void
  selectedColumn: number | undefined
  selectColumn: (i: number) => void
  selectedRound: number | undefined
  selectRound: (i: number) => void
}

export function Sheet(props: SheetProps) {
  const {
    sets,
    setsPerRound,
    roundCount,
    arrowsPerSet,
    select,
    selected,
    selectedColumn,
    selectColumn,
    selectedRound,
    selectRound
  } = props
  const header = Array.from({length: arrowsPerSet})
  const isDarker = useCallback((i: number) => {
    return (selectedColumn !== undefined && i !== selectedColumn)
  }, [selectedColumn])

  const totalRows = setsPerRound * roundCount
  const rows = []
  for (let i = 0; i < totalRows; i++) {
    const roundNum = Math.floor(i / setsPerRound)
    if (i % setsPerRound === 0) {
      const shots = sets.slice(roundNum * setsPerRound, roundNum * setsPerRound + setsPerRound).flat()
      const sum = shots.reduce((agg, v) => agg + codeToValue(v.code), 0)
      const avg = sum / shots.length
      rows.push(
        <>
          <div style='display: flex; justify-content: center' onClick={() => selectRound(roundNum)}>
            <div style='display: flex; gap: 2em; border-bottom: 1px solid pink;'>
              <span>Round: {roundNum + 1}</span>
              <span>Avg: {(isNaN(avg) ? 0 : avg).toFixed(2)}</span>
              <span>Total: {sum}</span>
            </div>
          </div>
          <div></div>
        </>
      )
    }
    rows.push(<Row maxSize={arrowsPerSet}
                   selected={i === selected}
                   selectedColumn={selectedColumn}
                   selectedRound={selectedRound}
                   setsPerRound={setsPerRound}
                   isDarker={selectedRound !== undefined && Math.floor(i / setsPerRound) !== selectedRound}
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

