import { useEffect, useState } from 'react'
import FlashcardList from '../flashcard/FlashcardList'
import { useNavigate, useParams } from 'react-router-dom' 
import type { Flashcard } from '../model/cardModel'

function DeckPage() {
  const navigate = useNavigate()
  const { deckTitle, deckId } = useParams()
  const id = Number(deckId)
  

  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    
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
      }
      return response.json()
    })
    .then(data => {
    
      const results = data.map((item: any) => ({
        id: item.id,
        question: item.questionText,
        answer: item.answerText,
        
        options: item.hint ? [`Hint: ${item.hint}`] : [] 
      }))
      setFlashcards(results)
    })
    .catch(error => {
      console.error('Error fetching flashcards:', error)
    })
    .finally(() => {
   
      setIsLoading(false)
    })
  }, [id]) 

  return (
    <div className="container">
      
      <h2 className="page-title">
        Reviewing: <span style={{ color: 'var(--primary)' }}>{deckTitle}</span>
      </h2>

      
      <div className="deck-controls">
        <button 
          className="btn btn-outline" 
          onClick={() => navigate('/your-deck')}
        >
          ← Back to Library
        </button>

        <button 
          className="btn" 
          onClick={() => navigate(`/decks/${id}/${deckTitle}/add-flashcard`)}
        >
          + Add Flashcard
        </button>
      </div>

    
      

      {isLoading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      {!isLoading && flashcards.length === 0 && (
        <div className="empty-state">
          <h3>No flashcards found in this deck.</h3>
          <p>Click "Add Flashcard" to get started!</p>
        </div>
      )}

      {!isLoading && flashcards.length > 0 && (
        <FlashcardList flashcards={flashcards} />
      )}
    </div>
  )
}

export default DeckPage