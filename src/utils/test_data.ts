import { codeToValue, getCode } from "../components/scoreEditor/targetFace";
import { Session, ShotInfo } from "../imodels/session";

export function generateSession(rounds: number, sets: number, arrowsPerSet: number, offset?: number): Session {
  const s: Session = {
    id: 0,
    happensAt: new Date(),
    desc: "Some description.",
    rounds: rounds,
    setsPerRound: sets,
    shotsPerSet: arrowsPerSet,
    sets: [],
    total: 0,
    avg: 0,
  }
  if (Math.random() > 0.5) {
    s.desc = undefined
  }

  let shootCount = 0
  for (let i = 0; i < rounds * sets; i++) {
    const shots: ShotInfo[] = []
    if (offset !== undefined) {
      const limit = i + 1 < rounds * sets ? arrowsPerSet : arrowsPerSet - (offset ?? 0)
      for (let j = 0; j < limit; j++) {
        const x = Math.random() * 550
        const y = Math.random() * 550
        const code = getCode(x, y)
        shots.push({x, y, code})
        s.total += codeToValue(code)
        shootCount++
      }
    }
    s.sets.push(shots)
  }
  s.avg = s.total / shootCount

  return s
}
