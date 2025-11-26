import React from 'react'
import Deck from './Deck'
import type { deck } from './model/deckModel'

function YourDeckPage() {

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Logic to add a new card to the deck goes here
  }

  return (
    <div className="your-deck-page">
      <h2>Your Decks</h2>
      {/* Logic to display user's decks goes here */}
      <div className='deck-container'>
        <Deck deck={SAMPLE_DECK} />
      </div>
    </div>
  )
}

const SAMPLE_DECK: deck = {
  id: 1,
  title: 'Sample Deck'
}

export default YourDeckPage
