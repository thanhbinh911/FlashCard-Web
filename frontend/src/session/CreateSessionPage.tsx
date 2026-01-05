import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { deck } from '../model/deckModel';
import { FaLayerGroup, FaClock, FaPlay, FaArrowLeft, FaCheckSquare } from 'react-icons/fa';
import '../style/Session.css';

function CreateSessionPage() {
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState('REGULAR');
  const [decks, setDecks] = useState<deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<number>(0);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(60);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const modes = ['REGULAR', 'MCQ', 'REVIEW'];

  useEffect(() => {
    fetch('http://localhost:8080/api/decks', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setDecks(data);
        if (data.length > 0) setSelectedDeckId(data[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/sessions/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        deckId: selectedDeckId,
        timeLimitSeconds,
        isPracticeMode,
        sessionMode
      })
    })
      .then(res => res.ok ? navigate('/active-session') : console.error("Error starting session"))
      .catch(err => console.error(err));
  };

  return (
    <div className="session-page-container">
      <div className="session-card">
        <h2 className="page-title">Create New Session</h2>
        
        <form onSubmit={handleCreateSession}>
          <div className="form-group">
            <label className="control-label" htmlFor="deck">
              <FaLayerGroup /> Deck
            </label>
            <select
              id="deck"
              className="form-select"
              value={selectedDeckId}
              onChange={e => setSelectedDeckId(Number(e.target.value))}
            >
              {decks.map(deck => <option value={deck.id} key={deck.id}>{deck.title}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="control-label" htmlFor="mode">
              <FaCheckSquare /> Session Mode
            </label>
            <select
              id="mode"
              className="form-select"
              value={sessionMode}
              onChange={e => setSessionMode(e.target.value)}
            >
              {modes.map(m => <option value={m} key={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="control-label" htmlFor="timeLimit">
              <FaClock /> Time Limit (seconds)
            </label>
            <input
              id="timeLimit"
              type="number"
              className="form-input"
              value={timeLimitSeconds}
              onChange={e => setTimeLimitSeconds(Number(e.target.value))}
            />
          </div>

          <label className="checkbox-group">
            <input
              type="checkbox"
              checked={isPracticeMode}
              onChange={() => setIsPracticeMode(!isPracticeMode)}
            />
            <span>Enable Practice Mode</span>
          </label>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              <FaPlay style={{marginRight: '8px'}}/> Start Learning
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/flashcards')}>
              <FaArrowLeft style={{marginRight: '8px'}}/> Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSessionPage;