import React, { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { deck } from '../model/deckModel';
import { FaLayerGroup } from 'react-icons/fa';

function CreateSessionPage() {
  const navigate = useNavigate();
  const [sessionMode, setSessionMode] = useState('REGULAR');
  const [decks, setDecks] = React.useState<deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState(0);

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

  return (
    <>
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
      </div>
    </>

  )
}

export default CreateSessionPage