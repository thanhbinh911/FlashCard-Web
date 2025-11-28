import React from 'react'
import { useNavigate } from 'react-router-dom'

function CreateDeckPage() {
  const navigate = useNavigate()

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')

  const handleCreateDeck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Logic to create a new deck goes here
    fetch('http://localhost:8080/api/decks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ title, description })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Deck created:', data)
      navigate('/your-deck')
    })
    .catch(error => {
      console.error('Error creating deck:', error)
    })
  }

  return (
    <div className="create-deck-page">
      <form className='deck-form' onSubmit={handleCreateDeck}>
        <div className="form-group">
          <label htmlFor="deckTitle" className="form-label">Deck Title</label>
          <input
            type="text"
            id="deckTitle"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter deck title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="deckDescription" className="form-label">Deck Description</label>
          <textarea
            id="deckDescription"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter deck description"
          />
        </div>
        <button className="btn" type="submit">Create Deck</button>
      </form>
    </div>
  )
}



export default CreateDeckPage
