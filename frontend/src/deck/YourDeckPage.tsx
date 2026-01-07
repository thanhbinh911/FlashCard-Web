import React, { useEffect } from 'react'
import type { deck } from '../model/deckModel'
import DecksList from './DecksList'
import Navbar from '../Navbar'
import { FaPlus, FaLayerGroup } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function YourDeckPage() {
  // User's deck collection loaded from backend
  const [decks, setDecks] = React.useState<deck[]>([])
  // Router helper for navigation actions
  const navigate = useNavigate();

  // Load all decks for the authenticated user on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/decks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setDecks(data)
      console.log("Fetched decks:", data)
      })
    .catch(err => console.error(err))
  }, [])

  return (
    <>
      <Navbar />
      <div className="container">
        

        {/* Header: page title and quick create button (shown when decks exist) */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem'
        }}>
          <h2 className="page-title" style={{margin: 0, textAlign: 'left'}}>Your Library</h2>
          

          {decks.length > 0 && (
            <button className="btn" onClick={() => navigate('/create-deck')}>
              <FaPlus /> Create New Deck
            </button>
          )}
        </div>


        {/* Main content: empty state or deck list grid */}
        {decks.length === 0 ? (
      
           <div className="empty-state">
             <div style={{marginBottom: '1rem', color: '#bdc3c7'}}>
                <FaLayerGroup size={48} />
             </div>
             <h3 style={{marginTop: 0, color: '#2c3e50'}}>No decks found</h3>
             <p style={{marginBottom: '1.5rem'}}>Create your first flashcard deck to get started!</p>
             <button className="btn" onClick={() => navigate('/create-deck')}>
                <FaPlus /> Create Your First Deck
             </button>
           </div>
        ) : (
           <DecksList decks={decks} />
        )}
      </div>
    </>
  )
}

export default YourDeckPage