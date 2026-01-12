import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deckApi } from '../api/deckApi'
import './CreateDeckPage.css'

function CreateDeckPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [deckData, setDeckData] = useState({
        title: '',
        description: '',
        publicDeck: true,
    })
    const [flashcards, setFlashcards] = useState([
        { questionText: '', answerText: '', hint: '' },
        { questionText: '', answerText: '', hint: '' },
    ])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const createMutation = useMutation({
        mutationFn: (data) => deckApi.createDeck(data),
        onSuccess: () => {
            // Invalidate all deck-related queries so homepage fetches fresh data
            queryClient.invalidateQueries({ queryKey: ['decks'] })
            // Show success message then navigate
            setSuccess(true)
            setTimeout(() => {
                navigate('/')
            }, 1500)
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to create deck')
        },
    })

    const handleDeckChange = (e) => {
        const { name, value, type, checked } = e.target
        setDeckData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleFlashcardChange = (index, field, value) => {
        setFlashcards(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const addFlashcard = () => {
        setFlashcards(prev => [...prev, { questionText: '', answerText: '', hint: '' }])
    }

    const removeFlashcard = (index) => {
        if (flashcards.length <= 2) {
            setError('Minimum 2 flashcards required')
            return
        }
        setFlashcards(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        // Validate
        if (!deckData.title.trim()) {
            setError('Title is required')
            return
        }

        const validFlashcards = flashcards.filter(
            f => f.questionText.trim() && f.answerText.trim()
        )

        if (validFlashcards.length < 2) {
            setError('At least 2 complete flashcards are required')
            return
        }

        createMutation.mutate({
            ...deckData,
            flashcards: validFlashcards,
        })
    }

    return (
        <div className="create-deck-page page">
            <div className="container">
                <div className="page-header">
                    <h1>Create New Deck</h1>
                    <p>Build your flashcard deck with at least 2 cards</p>
                </div>


                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                {success && (
                    <div className="alert alert-success">✓ Deck created successfully! Redirecting...</div>
                )}

                <form onSubmit={handleSubmit} className="create-deck-form">
                    {/* Deck Info */}
                    <div className="form-section">
                        <h2>Deck Information</h2>

                        <div className="form-group">
                            <label className="form-label" htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-input"
                                placeholder="e.g., JavaScript Basics"
                                value={deckData.title}
                                onChange={handleDeckChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-input form-textarea"
                                placeholder="What is this deck about?"
                                value={deckData.description}
                                onChange={handleDeckChange}
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="publicDeck"
                                    checked={deckData.publicDeck}
                                    onChange={handleDeckChange}
                                />
                                <span className="checkbox-custom"></span>
                                Make this deck public
                            </label>
                            <p className="form-hint">Public decks can be viewed and studied by anyone</p>
                        </div>
                    </div>

                    {/* Flashcards */}
                    <div className="form-section">
                        <div className="section-header">
                            <h2>Flashcards ({flashcards.length})</h2>
                            <button type="button" className="btn btn-secondary" onClick={addFlashcard}>
                                + Add Card
                            </button>
                        </div>

                        <div className="flashcards-form">
                            {flashcards.map((card, index) => (
                                <div key={index} className="flashcard-form-card">
                                    <div className="card-header">
                                        <span className="card-number">Card {index + 1}</span>
                                        {flashcards.length > 2 && (
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => removeFlashcard(index)}
                                            >
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Question *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter your question"
                                            value={card.questionText}
                                            onChange={(e) => handleFlashcardChange(index, 'questionText', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Answer *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter the answer"
                                            value={card.answerText}
                                            onChange={(e) => handleFlashcardChange(index, 'answerText', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Hint (optional)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Add a hint to help remember"
                                            value={card.hint}
                                            onChange={(e) => handleFlashcardChange(index, 'hint', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate('/decks')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Deck'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateDeckPage
