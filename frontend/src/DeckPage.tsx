import { useEffect, useState } from 'react'
import FlashcardList from './FlashcardList'
import { useNavigate, useParams } from 'react-router'
import type { Flashcard } from './model/cardModel'

function DeckPage() {
  const navigate = useNavigate()

  const {deckTitle} = useParams()
  const { deckId } = useParams()
  const id = Number(deckId)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

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
      console.log('Fetched flashcards:', data)
      const results = data.map((item: any) => ({
        id: item.id,
        question: item.questionText,
        answer: item.answerText,
        options: [`hint: ${item.hint}`]
      }))
      setFlashcards(results)
      console.log(flashcards)
    })
    .catch(error => {
      console.error('Error fetching flashcards:', error)
    })
  }, [])

  return (
    <div className={`deck-${id} deck-page`}>
      <h2>{deckTitle}</h2>
      <button className='add-card' onClick={() => navigate(`/decks/${id}/${deckTitle}/add-flashcard`)}>Add Flashcard</button>
      <button className='back-to-your-deck' onClick={() => navigate('/your-deck')}>Back to Your Decks</button>
      <FlashcardList flashcards={flashcards} />
    </div>
  )
}

export default DeckPage
