import React, { use, useEffect, useState } from 'react'
import FlashcardList from './FlashcardList'
import { useNavigate, useParams } from 'react-router'

function DeckPage() {
  const navigate = useNavigate()

  const [Flashcards, setFlashCards] = useState([])
  const { deckId } = useParams()
  const id = Number(deckId)

  useEffect(() => {
    console.log(`${id}`)
    fetch(`http://localhost:8080/api/decks/${id}/flashcards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      } else {
        console.log('Fetch successful')
      }
      return response.json()
    })
    .then(data => {
      // Handle the fetched flashcards data
      setFlashCards(data)
    })
    .catch(error => {
      console.error('Error fetching flashcards:', error)
    })
  }, [])

  return (
    <div className={`deck-${id} deck-page`}>
      <h2>{`Deck ${id}`}</h2>
      <button className='add-card' onClick={() => navigate(`/decks/${id}/add-flashcard`)}>Add Flashcard</button>
      <button className='back-to-your-deck' onClick={() => navigate('/your-deck')}>Back to Your Decks</button>
      <FlashcardList flashcards={Flashcards} />
    </div>
  )
}

export default DeckPage
