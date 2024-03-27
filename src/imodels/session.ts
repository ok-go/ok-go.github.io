export interface Session {
  id: number // can be undefined on creation
  desc?: string
  happensAt: Date
  total: number
  avg: number

  rounds: number
  setsPerRound: number
  shotsPerSet: number
  sets: ShotInfo[][]
}

export interface ShotInfo {
  x: number
  y: number
  code: string
}
