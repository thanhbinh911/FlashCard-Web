import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddCardPage() {
  const navigate = useNavigate();
  const { deckId, deckTitle } = useParams();

  const [questionText, setQuestion] = useState('');
  const [answerText, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {

    console.log(`Deck ID: ${deckId}`);
  }, [deckId]);
  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

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
      
        setQuestion('');
        setAnswer('');
        setHint('');
        setSuccessMsg('Flashcard added successfully!');
        
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        console.error('Failed to add flashcard');
        alert('Failed to add flashcard. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <div className="container">
      <h2 className="page-title">
        Add Card to: <span style={{color: 'var(--primary)'}}>{deckTitle || 'Deck'}</span>
      </h2>
      
      <div className="form-card">
    
        {successMsg && <div className="success-message">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="question" className="form-label">Question</label>
            <input 
              type="text" 
              id="question" 
              className="form-input" 
              required 
              value={questionText} 
              onChange={e => setQuestion(e.target.value)} 
              placeholder="e.g. What is the capital of Vietnam?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer" className="form-label">Answer</label>
            <textarea 
              id="answer" 
              className="form-textarea" 
              required 
              value={answerText} 
              onChange={e => setAnswer(e.target.value)} 
              placeholder="e.g. Hanoi"
              rows={3} 
              style={{ resize: 'vertical' }}
            />
          </div>


          <div className="form-group">
            <label htmlFor="hint" className="form-label">Hint (Optional)</label>
            <input 
              type="text" 
              id="hint" 
              className="form-input" 
              value={hint} 
              onChange={e => setHint(e.target.value)} 
              placeholder="e.g. Starts with H..."  
            />
          </div>


          <div className="form-actions">
            <button 
              type="submit" 
              className="btn" 
              disabled={isSubmitting}
              style={{ flex: 2 }} 
            >
              {isSubmitting ? 'Adding...' : 'Add Flashcard'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => navigate(`/decks/${deckId}/${deckTitle}`)}
            >
              Back to Deck
            </button>
          </div>

    
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
             <span 
               style={{ cursor: 'pointer', color: 'var(--text-light)', fontSize: '0.9rem', textDecoration: 'underline' }}
               onClick={() => navigate('/flashcards')}
             >
               Return to Dashboard
             </span>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddCardPage;