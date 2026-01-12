import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi } from '../api/sessionApi'
import LoadingSpinner from '../components/LoadingSpinner'
import './StudyPage.css'

function StudyPage() {
    const { deckId } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mode = searchParams.get('mode') || 'REGULAR'
    const timeLimitParam = searchParams.get('timeLimit') // in seconds
    const resumeSessionId = searchParams.get('resume') // session ID to resume

    const [session, setSession] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showAnswer, setShowAnswer] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [timeRemaining, setTimeRemaining] = useState(null)

    const isTestMode = mode === 'REGULAR' || mode === 'MCQ'

    // Start NEW session mutation
    const startMutation = useMutation({
        mutationFn: () => sessionApi.startSession({
            deckId: parseInt(deckId),
            sessionMode: mode,
            // Only send time limit for test modes
            timeLimitSeconds: isTestMode && timeLimitParam ? parseInt(timeLimitParam) : null,
        }),
        onSuccess: (data) => {
            setSession(data)
            if (data.timeLimitSeconds) {
                setTimeRemaining(data.timeLimitSeconds)
            }
            setIsLoading(false)
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to start session')
            setIsLoading(false)
        },
    })

    // RESUME existing session mutation
    const resumeMutation = useMutation({
        mutationFn: (sessionId) => sessionApi.resumeSession(sessionId),
        onSuccess: (data) => {
            setSession(data)
            if (data.timeLimitSeconds) {
                setTimeRemaining(data.timeLimitSeconds)
            }
            setIsLoading(false)
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to resume session')
            setIsLoading(false)
        },
    })

    // Finish session mutation
    const finishMutation = useMutation({
        mutationFn: (answerList) => {
            // For REVIEW mode, no session was created so just navigate back
            if (mode === 'REVIEW' || !session?.sessionId) {
                return Promise.resolve({ redirectOnly: true })
            }
            return sessionApi.finishSession(session.sessionId, answerList)
        },
        onSuccess: (result) => {
            // Remove the unfinished-sessions cache so HomePage updates
            // Add a small delay to ensure backend transaction has propagated
            setTimeout(() => {
                queryClient.removeQueries(['unfinished-sessions'])
            }, 500)

            if (result.redirectOnly) {
                navigate(`/decks/${deckId}`)
            } else {
                navigate(`/results/${session.sessionId}`)
            }
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to submit answers')
        },
    })

    // Start or resume session on mount
    useEffect(() => {
        if (resumeSessionId) {
            // Resume existing session
            resumeMutation.mutate(resumeSessionId)
        } else {
            // Start new session
            startMutation.mutate()
        }
    }, [])

    // Timer effect (only for test modes with time limit)
    useEffect(() => {
        if (!isTestMode || timeRemaining === null || timeRemaining <= 0) return

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleFinish()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeRemaining, isTestMode])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const currentQuestion = session?.questions?.[currentIndex]

    const handleAnswerChange = useCallback((value) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.flashcardId]: value,
        }))
    }, [currentQuestion])

    const handleNext = () => {
        setShowAnswer(false)
        if (currentIndex < session.questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        setShowAnswer(false)
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handleFinish = () => {
        const answerList = Object.entries(answers).map(([flashcardId, userAnswer]) => ({
            flashcardId: parseInt(flashcardId),
            userAnswer,
        }))

        finishMutation.mutate(answerList)
    }

    // Handle exiting review mode
    const handleExitReview = () => {
        navigate(`/decks/${deckId}`)
    }

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Starting study session..." />
    }

    if (error) {
        return (
            <div className="page container">
                <div className="alert alert-error">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate(`/decks/${deckId}`)}>
                    Back to Deck
                </button>
            </div>
        )
    }

    if (!session || !currentQuestion) {
        return <LoadingSpinner size="lg" text="Loading questions..." />
    }

    return (
        <div className="study-page page">
            <div className="container">
                {/* Header */}
                <div className="study-header">
                    <div className="study-info">
                        <span className={`study-mode badge ${mode === 'REVIEW' ? 'badge-info' : 'badge-success'}`}>
                            {mode === 'REVIEW' ? '👁️ Review' : mode === 'MCQ' ? '🔘 MCQ' : '✍️ Fill-in-blank'}
                        </span>
                        <span className="study-progress">
                            {currentIndex + 1} / {session.questions.length}
                        </span>
                    </div>
                    {isTestMode && timeRemaining !== null && (
                        <div className={`study-timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                            ⏱️ {formatTime(timeRemaining)}
                        </div>
                    )}
                    {mode === 'REVIEW' && (
                        <button className="btn btn-ghost btn-sm" onClick={handleExitReview}>
                            ✕ Exit Review
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentIndex + 1) / session.questions.length) * 100}%` }}
                    />
                </div>

                {/* Question Card */}
                <div className="study-card">
                    <div className="question-section">
                        <h2 className="question-label">Question</h2>
                        <p className="question-text">{currentQuestion.questionText}</p>

                        {currentQuestion.hint && !showAnswer && (
                            <p className="question-hint">💡 Hint: {currentQuestion.hint}</p>
                        )}
                    </div>

                    {/* Answer Section based on mode */}
                    <div className="answer-section">
                        {mode === 'MCQ' && currentQuestion.options && (
                            <div className="mcq-options">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`mcq-option ${answers[currentQuestion.flashcardId] === option ? 'selected' : ''}`}
                                        onClick={() => handleAnswerChange(option)}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {mode === 'REGULAR' && (
                            <div className="regular-answer">
                                <label className="form-label">Your Answer</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Type your answer..."
                                    value={answers[currentQuestion.flashcardId] || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                />
                            </div>
                        )}

                        {mode === 'REVIEW' && (
                            <div className="review-answer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowAnswer(!showAnswer)}
                                >
                                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                                </button>
                                {showAnswer && (
                                    <div className="revealed-answer">
                                        <strong>Answer:</strong> {currentQuestion.answerText || 'N/A'}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="study-navigation">
                    <button
                        className="btn btn-ghost"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        ← Previous
                    </button>

                    <div className="nav-dots">
                        {session.questions.map((_, idx) => (
                            <button
                                key={idx}
                                className={`nav-dot ${idx === currentIndex ? 'active' : ''} ${answers[session.questions[idx]?.flashcardId] ? 'answered' : ''}`}
                                onClick={() => {
                                    setShowAnswer(false)
                                    setCurrentIndex(idx)
                                }}
                            />
                        ))}
                    </div>

                    {currentIndex === session.questions.length - 1 ? (
                        mode === 'REVIEW' ? (
                            <button className="btn btn-primary" onClick={handleExitReview}>
                                Done Reviewing
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handleFinish}
                                disabled={finishMutation.isPending}
                            >
                                {finishMutation.isPending ? 'Submitting...' : 'Finish Test'}
                            </button>
                        )
                    ) : (
                        <button className="btn btn-primary" onClick={handleNext}>
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StudyPage
