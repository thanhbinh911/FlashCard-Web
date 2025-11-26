import React from 'react'
import Deck from './Deck'
import type { deck } from './model/deckModel'
import './style/YourDeck.css'

function YourDeckPage() {

  return (
    <div className="your-deck-page">
      <h2>Your Decks</h2>
      {/* Logic to display user's decks goes here */}
      <div className='deck-container'>
        <Deck deck={SAMPLE_DECK1} />
        <Deck deck={SAMPLE_DECK2} />
      </div>
    </div>
  )
}

const SAMPLE_DECK1: deck = {
  id: 1,
  title: 'Sample Deck'
}

const SAMPLE_DECK2: deck = {
  id: 2,
  title: 'Another Deck'
}

export default YourDeckPage
