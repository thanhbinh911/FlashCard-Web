export interface session {
  sessionId: number
  deckId: number
  deckTitle: string
  timeLimitSeconds: number // in seconds
  startedAt: string // ISO date string
}