import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import FlashcardList from '../flashcard/FlashcardList';


function ManageUserDeckFlashcard() {
  const navigate = useNavigate();
  const { deckId, deckTitle } = useParams();
  const [flashcards, setFlashcards] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)

    fetch(`http://localhost:8080/api/decks/${deckId}/flashcards`, {
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
  }, [deckId])

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
      </div>    

      {isLoading && (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      )}

      {!isLoading && flashcards.length === 0 && (
        <div className="empty-state">
          <h3>No flashcards found in this deck.</h3>
        </div>
      )}

      {!isLoading && flashcards.length > 0 && (
        <FlashcardList flashcards={flashcards} />
      )}
    </div>
  )
}

export default ManageUserDeckFlashcard