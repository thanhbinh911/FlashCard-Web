import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import type { FormEvent } from 'react'

function CreateDeckPage() {
  // Router navigation helper to redirect after successful creation
  const navigate = useNavigate()

  // Local form state: deck title and description
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [flashcards, setFlashcards] = useState([
    { questionText: '', answerText: '', hint: '' },
    { questionText: '', answerText: '', hint: '' }
  ])

  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...flashcards]
    newCards[index] = { ...newCards[index], [field]: value }
    setFlashcards(newCards)
  }

  const addCardField = () => {
    setFlashcards([...flashcards, { questionText: '', answerText: '', hint: '' }])
  }

  // Xóa ô nhập thẻ (giữ tối thiểu 2 thẻ)
  const removeCardField = (index: number) => {
    if (flashcards.length > 2) {
      setFlashcards(flashcards.filter((_, i) => i !== index))
    } else {
      alert("At least 2 flashcards are required!")
    }
  }

  // Submit handler: POST deck data to backend API
  // Expects a valid JWT token stored in localStorage under key "token"
  const handleCreateDeck = (e: FormEvent) => {
    e.preventDefault()

    fetch('http://localhost:8080/api/decks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, description, isPublic, flashcards})
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
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center', color: '#6c5ce7', marginBottom: '1.5rem' }}>Create New Deck</h2>

          {/* Deck creation form */}
          <form onSubmit={handleCreateDeck} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              {/* Deck title input (required) */}
              <label className="control-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Title</label>
              <input
                className="form-input"
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Spring Boot Basics"
                required
              />
            </div>
            <div>
              <label className="control-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Visibility
              </label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {/* Lựa chọn Public (True) */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic === true}
                    onChange={() => setIsPublic(true)}
                  />
                  Public
                </label>

                {/* Lựa chọn Private (False) */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic === false}
                    onChange={() => setIsPublic(false)}
                  />
                  Private
                </label>
              </div>
            </div>
            <div>
              {/* Optional description to explain deck purpose */}
              <label className="control-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Description</label>
              <textarea
                className="form-input"
                style={{ minHeight: '100px', fontFamily: 'inherit' }}
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="What is this deck about?"
              />
            </div>

            <hr />
            <h3 style={{ margin: '0.5rem 0' }}>Flashcards (Min 2)</h3>

            {/* Danh sách các ô nhập thẻ */}
            {flashcards.map((card, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>Card #{index + 1}</strong>
                  {flashcards.length > 2 && (
                    <button type="button" onClick={() => removeCardField(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                  )}
                </div>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <input 
                    className="form-input" 
                    placeholder="Question" 
                    value={card.questionText} 
                    onChange={e => handleCardChange(index, 'questionText', e.target.value)} 
                    required 
                  />
                  <input 
                    className="form-input" 
                    placeholder="Answer" 
                    value={card.answerText} 
                    onChange={e => handleCardChange(index, 'answerText', e.target.value)} 
                    required 
                  />
                  <input 
                    className="form-input" 
                    placeholder="Hint (Optional)" 
                    value={card.hint} 
                    onChange={e => handleCardChange(index, 'hint', e.target.value)} 
                  />
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline" onClick={addCardField} style={{ width: '100%', marginBottom: '1.5rem' }}>
              + Add Another Card
            </button>

            {/* Submit button triggers deck creation */}
            <button className="btn" type="submit" style={{ marginTop: '1rem' }}>Create Deck</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateDeckPage