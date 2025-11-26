import React from 'react'
import { useNavigate } from 'react-router-dom'

function CreateDeckPage() {
  const navigate = useNavigate()

  const [title, setTitle] = React.useState('')

  const handleCreateDeck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Logic to create a new deck goes here
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
        <button className="btn" type="submit" onClick={() => navigate('/your-deck')}>
          Create Deck</button>
      </form>
    </div>
  )
}



export default CreateDeckPage
