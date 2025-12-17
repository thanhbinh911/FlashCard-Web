import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function AddCardPage( ) {
  const navigate = useNavigate()
  const [questionText, setQuestion] = React.useState('');
  const [answerText, setAnswer] = React.useState('');
  const [hint, setHint] = React.useState('')
  const { deckId } = useParams()
  const {deckTitle} = useParams()
  

  useEffect(() => {
    // Check if user is authenticated
    console.log(`${deckId}`)
    console.log(localStorage.getItem('token'))
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Logic to add the flashcard goes here
    fetch(`http://localhost:8080/api/decks/${deckId}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ questionText, answerText, hint })
    })
    .then(response => {
      if (response.ok) {
        console.log('Flashcard added successfully')
        setQuestion('')
        setAnswer('')
        setHint('')
      } else {
        // Handle error
        console.log(JSON.stringify({ questionText, answerText, hint }))
        console.error('Failed to add flashcard')
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="add-card-page">
      <h2>Add a New Flashcard</h2>
      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input 
            type="text" 
            id="question" 
            className="question" 
            required 
            value={questionText } 
            onChange={e => setQuestion(e.target.value)} 
            placeholder='Type your question here'
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <input 
          type="text" 
          id="answer" 
          className="answer" 
          required 
          value={answerText} 
          onChange={e => setAnswer(e.target.value)} 
          placeholder='Type the answer here'  
        />
        </div>
        <div className="form-group">
          <label htmlFor="hint">Hint:</label>
          <input 
          type="text" 
          id="hint" 
          className="hint" 
          value={hint} 
          onChange={e => setHint(e.target.value)} 
          placeholder='Type a hint here'  
        />
        </div>
        <button type="submit">Add Flashcard</button>
        <button className='back-to-deck' onClick={() => navigate(`/decks/${deckId}/${deckTitle}`)}>Back to Deck</button>
        <button className='back-to-home' onClick={() => navigate('/flashcards')}>Back to Home</button>
      </form>
    </div>
  )
}

export default AddCardPage
