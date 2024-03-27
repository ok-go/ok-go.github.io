import './scoreEditor.css'
import { codeToValue, getCode, TargetFace } from "./targetFace";
import { useReducer } from "preact/compat";
import { Sheet } from "./sheet";
import { InfoLine } from "./infoline";
import { Session, ShotInfo } from "../../imodels/session";

interface ScoreEditorState {
  session: Session
  shotsCount: number
  selectedRow?: number
  selectedCol?: number
  changed: boolean
}

type ScoreEditorAction = ActionUpdate | ActionSelectRow | ActionRemove | ActionSelectCol | ActionDescription

interface ActionSelectCol {
  type: 'selectCol'
  id?: number
}

interface ActionSelectRow {
  type: 'selectRow'
  id?: number
}

interface ActionUpdate {
  type: 'update'
  x: number
  y: number
  arrowsPerSet: number
}

interface ActionRemove {
  type: 'remove'
}

interface ActionDescription {
  type: 'description'
  value?: string
}

const reducer = (state: ScoreEditorState, action: ScoreEditorAction) => {
  switch (action.type) {
    case 'selectRow':
      state.selectedRow = state.selectedRow === action.id ? undefined : action.id
      state.selectedCol = undefined
      return {...state}
    case 'selectCol':
      state.selectedRow = undefined
      state.selectedCol = state.selectedCol === action.id ? undefined : action.id
      return {...state}
    case 'update':
      if (state.selectedRow === undefined || state.session.sets[state.selectedRow].length >= action.arrowsPerSet) {
        return state
      }
      const code = getCode(action.x, action.y)
      state.session.sets[state.selectedRow].push({x: action.x, y: action.y, code: code})
      state.shotsCount += 1
      state.session.total = state.session.total + codeToValue(code)
      state.session.avg = state.session.total / state.shotsCount
      state.changed = true
      return {...state}
    case 'remove':
      if (state.selectedRow === undefined || state.session.sets[state.selectedRow].length === 0) {
        return state
      }
      const set = state.session.sets[state.selectedRow]
      const shots = set.slice(0, -1)
      const oldSum = set.reduce((agg, s) => agg + codeToValue(s.code), 0)
      const newSum = shots.reduce((agg, s) => agg + codeToValue(s.code), 0)
      state.session.sets[state.selectedRow] = shots
      state.shotsCount -= 1
      state.session.total = state.session.total - oldSum + newSum
      state.session.avg = state.session.total / state.shotsCount
      state.changed = true
      return {...state}
    case 'description':
      state.session.desc = action.value
      return {...state}
    default:
      throw new Error(`unexpected action: ${action}`)
  }
}

interface ScoreEditorProps {
  session: Session
  done: (s: Session, changed: boolean) => void
}

export function ScoreEditor(props: ScoreEditorProps) {
  const [state, dispatch] = useReducer(reducer, {
    changed: false,
    session: props.session,
    shotsCount: props.session.sets.reduce((agg, s) => agg + s.length, 0)
  })

  const toDraw = getToDraw(state.session.sets, state.selectedRow, state.selectedCol)

  return (
    <div className='scoreeditor'>
      <Sheet
        sets={state.session.sets}
        roundCount={state.session.rounds}
        setsPerRound={state.session.setsPerRound}
        arrowsPerSet={state.session.shotsPerSet}
        selected={state.selectedRow}
        selectedColumn={state.selectedCol}
        select={(i) => dispatch({type: 'selectRow', id: i,})}
        selectColumn={(i) => dispatch({type: 'selectCol', id: i,})}
      />
      <InfoLine total={state.session.total}
                shotCount={state.shotsCount}
                removeItem={() => dispatch({type: 'remove'})}
                done={() => props.done(state.session, state.changed)} />
      <TargetFace shots={toDraw}
                  update={(x, y) => dispatch({type: 'update', x, y, arrowsPerSet: state.session.shotsPerSet})} />
    </div>
  )
}

function getToDraw(sets: ShotInfo[][], selectedRow?: number, selectedCol?: number): ShotInfo[] {
  if (selectedRow !== undefined) {
    return sets[selectedRow]
  }
  if (selectedCol !== undefined) {
    return sets.reduce<ShotInfo[]>((agg, set) => {
      agg.push(set[selectedCol])
      return agg
    }, [])
  }
  return sets.flat()
}
