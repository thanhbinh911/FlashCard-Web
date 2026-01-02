import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'

function CreateDeckPage() {
  // Router navigation helper to redirect after successful creation
  const navigate = useNavigate()

  // Local form state: deck title and description
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')

  // Submit handler: POST deck data to backend API
  // Expects a valid JWT token stored in localStorage under key "token"
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault()

    fetch('http://localhost:8080/api/decks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ title, description })
    })
    // Parse JSON response; backend should return the created deck
    .then(res => res.json())
    // On success, navigate to the user's decks page
    .then(() => navigate('/your-deck'))
    // Minimal error logging; consider showing a user-facing message
    .catch(err => console.error(err))
  }

  return (
    <>
      <Navbar />
      {/* Centered form container with card-like styling */}
      <div className="container" style={{maxWidth: '600px'}}>
        <div style={{background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
          <h2 style={{textAlign: 'center', color: '#6c5ce7', marginBottom: '1.5rem'}}>Create New Deck</h2>
          
          {/* Deck creation form */}
          <form onSubmit={handleCreateDeck} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
            <div>
              {/* Deck title input (required) */}
              <label className="control-label" style={{marginBottom: '0.5rem', display: 'block'}}>Title</label>
              <input 
                className="form-input" 
                value={title} onChange={e => setTitle(e.target.value)} 
                placeholder="Ex: Spring Boot Basics"
                required 
              />
            </div>
            <div>
              {/* Optional description to explain deck purpose */}
              <label className="control-label" style={{marginBottom: '0.5rem', display: 'block'}}>Description</label>
              <textarea 
                className="form-input" 
                style={{minHeight: '100px', fontFamily: 'inherit'}}
                value={description} onChange={e => setDescription(e.target.value)} 
                placeholder="What is this deck about?"
              />
            </div>
            {/* Submit button triggers deck creation */}
            <button className="btn" type="submit" style={{marginTop: '1rem'}}>Create Deck</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateDeckPage