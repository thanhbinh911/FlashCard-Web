import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { deck } from '../model/deckModel';
import { FaLayerGroup } from 'react-icons/fa';

function CreateSessionPage() {
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState('REGULAR');
  const [decks, setDecks] = React.useState<deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(0);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const mode = ['REGULAR', 'MCQ', 'REVIEW'];

  useEffect(() => {
    fetch('http://localhost:8080/api/decks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setDecks(data))
      .catch(err => console.error(err))
  }, [])

  function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    
    fetch('http://localhost:8080/api/sessions/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        deckId: decks[selectedDeck].id,
        timeLimitSeconds: timeLimitSeconds,
        isPracticeMode: isPracticeMode,
        sessionMode: sessionMode
      })
    })
      .then(res => res.json())
      .then(() => navigate('/active-session'))
      .catch(err => console.error(err))
  }

  return (
    <>
      <h2 className="page-title" style={{ marginBottom: '1.5rem' }}>Create New Session</h2>
      <div className="control-group">

        <label className="control-label" htmlFor="deck" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaLayerGroup />
          <span>Deck</span>
        </label>
        <select
          id="deck"
          className="form-select"
          value={decks.length > 0 ? decks[selectedDeck].id : 0}
          onChange={e => setSelectedDeck(Number(e.target.value))}
        >
          {decks.map(deck =>
            <option value={deck.id} key={deck.id}>{deck.title}</option>
          )}
        </select>

        <label className="control-label" htmlFor="mode" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <FaLayerGroup />
          <span>Session Mode</span>
        </label>
        <select
          id="mode"
          className="form-select"
          value={sessionMode}
          onChange={e => setSessionMode(e.target.value)}
        >
          {mode.map(m => (
            <option value={m} key={m}>{m}</option>
          ))}
        </select>

        <label className="control-label" htmlFor="timeLimit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <FaLayerGroup />
          <span>Time Limit (seconds)</span>
        </label>
        <input
          id="timeLimit"
          type="number"
          className="form-input"
          value={timeLimitSeconds}
          onChange={e => setTimeLimitSeconds(Number(e.target.value))}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer', fontWeight: 'normal' }}>
          <input
            type="checkbox"
            checked={isPracticeMode}
            onChange={() => setIsPracticeMode(!isPracticeMode)}
          />
          Practice Mode
        </label>
        <button 
          className="btn" 
          style={{ marginTop: '1.5rem' }}
          onClick={handleCreateSession}
        >
          Create Session
        </button>
      </div>
    </>

  )
}

export default CreateSessionPage