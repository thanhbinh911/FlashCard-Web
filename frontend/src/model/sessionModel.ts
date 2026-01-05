export interface session {
  sessionId: number
  deckId: number
  deckTitle: string
  timeLimit: number // in seconds
  startedAt: string // ISO date string
}