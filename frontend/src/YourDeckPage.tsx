import React, { useEffect } from 'react'
import type { deck } from './model/deckModel'
import './style/YourDeck.css'
import DecksList from './DecksList'

function YourDeckPage() {

  const [decks, setDecks] = React.useState<deck[]>([])

  useEffect(() => {
    // Fetch user's decks from backend or local storage
    fetch('http://localhost:8080/api/decks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setDecks(data)
    })
    .catch(error => {
      console.error('Error fetching decks:', error)
    })
  }, [])

  return (
    <div className="your-deck-page">
      <h2>Your Decks</h2>
      {/* Logic to display user's decks goes here */}
      <div className='deck-container'>
        <DecksList decks={decks} />
      </div>
    </div>
  )
}

export default YourDeckPage
