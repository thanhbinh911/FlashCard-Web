import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deckApi } from '../api/deckApi'
import { flashcardApi } from '../api/flashcardApi'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import './DeckDetailPage.css'

function DeckDetailPage() {
    const { deckId } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const queryClient = useQueryClient()

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showStudyModal, setShowStudyModal] = useState(false)
    const [sessionMode, setSessionMode] = useState('REGULAR')
    const [timeLimit, setTimeLimit] = useState(5) // Default 5 minutes

    // Fetch deck
    const { data: deck, isLoading: deckLoading, error: deckError } = useQuery({
        queryKey: ['deck', deckId],
        queryFn: () => deckApi.getDeck(deckId),
    })

    // Fetch flashcards
    const { data: flashcards, isLoading: flashcardsLoading } = useQuery({
        queryKey: ['flashcards', deckId],
        queryFn: () => flashcardApi.getFlashcards(deckId),
        enabled: !!deck,
    })

    // Delete deck mutation
    const deleteMutation = useMutation({
        mutationFn: () => deckApi.deleteDeck(deckId),
        onSuccess: () => {
            queryClient.invalidateQueries(['decks'])
            navigate('/decks')
        },
    })

    // Toggle visibility mutation
    const toggleVisibilityMutation = useMutation({
        mutationFn: () => deckApi.updateVisibility(deckId, !deck.publicDeck),
        onSuccess: (updatedDeck) => {
            // Update the specific deck in cache immediately
            queryClient.setQueryData(['deck', deckId], updatedDeck)
            // Invalidating list query is still good practice
            queryClient.invalidateQueries(['decks'])
        },
        onError: (error) => {
            console.error('Failed to toggle visibility:', error);
            alert(`Failed to update visibility: ${error.response?.data?.message || error.message}`);
        },
    })

    const isOwner = deck?.ownerUsername === user?.username
    const isTestMode = sessionMode === 'REGULAR' || sessionMode === 'MCQ'

    const handleToggleVisibility = () => {
        toggleVisibilityMutation.mutate()
    }

    const handleOpenStudyModal = () => {
        setShowStudyModal(true)
    }

    const handleStartStudy = () => {
        // For REVIEW mode, go directly - no time limit needed
        if (sessionMode === 'REVIEW') {
            navigate(`/study/${deckId}?mode=REVIEW`)
            return
        }

        // For test modes, include time limit in URL
        const timeLimitSeconds = timeLimit * 60 // Convert minutes to seconds
        navigate(`/study/${deckId}?mode=${sessionMode}&timeLimit=${timeLimitSeconds}`)
    }

    const handleDelete = () => {
        deleteMutation.mutate()
    }

    if (deckLoading) {
        return <LoadingSpinner size="lg" text="Loading deck..." />
    }

    if (deckError) {
        return (
            <div className="page container">
                <div className="alert alert-error">
                    Failed to load deck. It may not exist or you don't have access.
                </div>
                <Link to="/decks" className="btn btn-secondary">Back to Decks</Link>
            </div>
        )
    }

    return (
        <div className="deck-detail-page page">
            <div className="container">
                {/* Deck Header */}
                <div className="deck-header">
                    <div className="deck-header-info">
                        <div className="deck-badges">
                            {deck.publicDeck ? (
                                <span className="badge badge-success">Public</span>
                            ) : (
                                <span className="badge">Private</span>
                            )}
                            {isOwner && <span className="badge badge-warning">Owner</span>}
                        </div>
                        <h1>{deck.title}</h1>
                        <p className="deck-description">{deck.description || 'No description'}</p>
                        <div className="deck-meta">
                            <span>📇 {flashcards?.length || 0} cards</span>
                            <span>👤 {deck.ownerUsername}</span>
                        </div>
                    </div>

                    <div className="deck-actions">
                        {isAuthenticated && (
                            <div className="study-options">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleOpenStudyModal}
                                    disabled={!flashcards || flashcards.length === 0}
                                >
                                    🎯 Start Study Session
                                </button>
                            </div>
                        )}

                        {isOwner && (
                            <div className="owner-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleToggleVisibility}
                                    disabled={toggleVisibilityMutation.isPending}
                                >
                                    {toggleVisibilityMutation.isPending
                                        ? 'Updating...'
                                        : deck.publicDeck
                                            ? '🔒 Make Private'
                                            : '🌐 Make Public'}
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Deck
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Flashcards List */}
                <section className="flashcards-section">
                    <h2>Flashcards ({flashcards?.length || 0})</h2>

                    {flashcardsLoading && <LoadingSpinner text="Loading flashcards..." />}

                    {flashcards && flashcards.length === 0 && (
                        <div className="empty-state">
                            <p>No flashcards yet</p>
                        </div>
                    )}

                    {flashcards && flashcards.length > 0 && (
                        <div className="flashcards-list">
                            {flashcards.map((card, index) => (
                                <div key={card.id} className="flashcard-preview">
                                    <div className="flashcard-number">{index + 1}</div>
                                    <div className="flashcard-content">
                                        <div className="flashcard-question">
                                            <strong>Q:</strong> {card.questionText}
                                        </div>
                                        <div className="flashcard-answer">
                                            <strong>A:</strong> {card.answerText}
                                        </div>
                                        {card.hint && (
                                            <div className="flashcard-hint">
                                                <em>Hint: {card.hint}</em>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Study Session Modal */}
            {showStudyModal && (
                <div className="modal-overlay" onClick={() => setShowStudyModal(false)}>
                    <div className="modal-content study-modal" onClick={e => e.stopPropagation()}>
                        <h3>📚 Start Study Session</h3>
                        <p className="modal-subtitle">Choose your study mode and settings</p>

                        <div className="study-modal-options">
                            {/* Mode Selection */}
                            <div className="form-group">
                                <label className="form-label">Study Mode</label>
                                <div className="mode-buttons">
                                    <button
                                        className={`mode-btn ${sessionMode === 'REGULAR' ? 'active' : ''}`}
                                        onClick={() => setSessionMode('REGULAR')}
                                    >
                                        <span className="mode-icon">✍️</span>
                                        <span className="mode-name">Fill-in-blank</span>
                                        <span className="mode-desc">Type your answer</span>
                                    </button>
                                    <button
                                        className={`mode-btn ${sessionMode === 'MCQ' ? 'active' : ''}`}
                                        onClick={() => setSessionMode('MCQ')}
                                    >
                                        <span className="mode-icon">🔘</span>
                                        <span className="mode-name">Multiple Choice</span>
                                        <span className="mode-desc">Pick the right answer</span>
                                    </button>
                                    <button
                                        className={`mode-btn ${sessionMode === 'REVIEW' ? 'active' : ''}`}
                                        onClick={() => setSessionMode('REVIEW')}
                                    >
                                        <span className="mode-icon">👁️</span>
                                        <span className="mode-name">Review Only</span>
                                        <span className="mode-desc">Just flip through cards</span>
                                    </button>
                                </div>
                            </div>

                            {/* Time Limit (only for test modes) */}
                            {isTestMode && (
                                <div className="form-group">
                                    <label className="form-label">⏱️ Time Limit</label>
                                    <div className="time-selector">
                                        <button
                                            className={`time-btn ${timeLimit === 3 ? 'active' : ''}`}
                                            onClick={() => setTimeLimit(3)}
                                        >
                                            3 min
                                        </button>
                                        <button
                                            className={`time-btn ${timeLimit === 5 ? 'active' : ''}`}
                                            onClick={() => setTimeLimit(5)}
                                        >
                                            5 min
                                        </button>
                                        <button
                                            className={`time-btn ${timeLimit === 10 ? 'active' : ''}`}
                                            onClick={() => setTimeLimit(10)}
                                        >
                                            10 min
                                        </button>
                                        <button
                                            className={`time-btn ${timeLimit === 15 ? 'active' : ''}`}
                                            onClick={() => setTimeLimit(15)}
                                        >
                                            15 min
                                        </button>
                                        <button
                                            className={`time-btn ${timeLimit === 30 ? 'active' : ''}`}
                                            onClick={() => setTimeLimit(30)}
                                        >
                                            30 min
                                        </button>
                                    </div>
                                    <p className="time-info">
                                        Session will auto-submit when time runs out
                                    </p>
                                </div>
                            )}

                            {!isTestMode && (
                                <div className="review-info">
                                    <p>📖 Review mode lets you browse cards at your own pace. No scoring, no time limit.</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowStudyModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleStartStudy}
                            >
                                {isTestMode ? '🎯 Start Test' : '👁️ Start Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Delete Deck?</h3>
                        <p>Are you sure you want to delete "{deck.title}"? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeckDetailPage
