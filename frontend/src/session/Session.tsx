import React from 'react'
import type { session } from '../model/sessionModel'

interface SessionProps {
  session: session
}

const Session = ({ session }: SessionProps) => {
  return (
    <div>
      <h2>Session Details</h2>
      <p>ID: {session.sessionId}</p>
      <p>Deck ID: {session.deckId}</p>
      <p>Deck Title: {session.deckTitle}</p>
      <p>Time Limit: {session.timeLimit} seconds</p>
      <p>Started At: {session.startedAt}</p>
    </div>
  )
}

export default Session