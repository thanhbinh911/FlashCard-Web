import React from 'react'
import type { deck } from './model/deckModel'
import Deck from './Deck'

interface DecksListProps {
  decks: deck[]
}

const DecksList = ({ decks }: DecksListProps) => {
  return (
    <div className='deck-grid'>
      {decks.map(deck => {
          return <Deck deck = {deck} key={deck.id} />
        }
      )}
    </div>
  )
}

export default DecksList
