import React, { use, useEffect, useState } from 'react'
import FlashcardList from './FlashcardList'
import { useNavigate } from 'react-router'

function DeckPage({ deckId }: { deckId: number }) {
  const navigate = useNavigate()

  const [Flashcards, setFlashCards] = useState([])

  useEffect(() => {
    fetch(`http://localhost:5000/decks/${deckId}/flashcards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      // Handle the fetched flashcards data
      setFlashCards(data)
    })
    .catch(error => {
      console.error('Error fetching flashcards:', error)
    })
  }, [])

  return (
    <div className={`deck-${deckId} deck-page`}>
      <h2>{`Deck ${deckId}`}</h2>
      <button className='add-card' onClick={() => navigate(`/decks/${deckId}/add-flashcard`)}>Add Flashcard</button>
      <FlashcardList flashcards={Flashcards} />
    </div>
  )
}

export default DeckPage
