import React, { use } from 'react'
import { useNavigate } from 'react-router-dom';

function AddCardPage( {deckId}: {deckId: number} ) {
  const navigate = useNavigate()
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [hint, setHint] = React.useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Logic to add the flashcard goes here
    fetch(`http://localhost:5000/decks/${deckId}/flashcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ question, answer, hint })
    })
    .then(response => {
      if (response.ok) {
        setQuestion('');
        setAnswer('');
        setHint('');
      } else {
        // Handle error
        console.error('Failed to add flashcard');
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
            value={question} 
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
          value={answer} 
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
        <button className='back-to-deck' onClick={() => navigate(`/decks/${deckId}`)}>Back to Deck</button>
      </form>
    </div>
  )
}

export default AddCardPage
