import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { sessionApi } from '../api/sessionApi'
import LoadingSpinner from '../components/LoadingSpinner'
import './ResultsPage.css'

function ResultsPage() {
    const { sessionId } = useParams()

    const { data: summary, isLoading, error } = useQuery({
        queryKey: ['session-summary', sessionId],
        queryFn: () => sessionApi.getSessionSummary(sessionId),
        retry: false,
    })

    if (isLoading) {
        return <LoadingSpinner size="lg" text="Loading results..." />
    }

    if (error) {
        return (
            <div className="page container">
                <div className="alert alert-error">
                    Failed to load session results.
                </div>
                <Link to="/decks" className="btn btn-secondary">Back to Decks</Link>
            </div>
        )
    }

    const percentage = summary.totalCards > 0
        ? Math.round((summary.correctCount / summary.totalCards) * 100)
        : 0

    const getGrade = (pct) => {
        if (pct >= 90) return { letter: 'A', color: 'var(--color-success)' }
        if (pct >= 80) return { letter: 'B', color: '#22c55e' }
        if (pct >= 70) return { letter: 'C', color: 'var(--color-warning)' }
        if (pct >= 60) return { letter: 'D', color: '#f97316' }
        return { letter: 'F', color: 'var(--color-error)' }
    }

    const grade = getGrade(percentage)

    return (
        <div className="results-page page">
            <div className="container">
                {/* Results Header */}
                <div className="results-header">
                    <h1>Session Complete! 🎉</h1>
                    <p>Here's how you did</p>
                </div>

                {/* Score Card */}
                <div className="score-card">
                    <div className="score-circle" style={{ '--score-color': grade.color }}>
                        <div className="score-percentage">{percentage}%</div>
                        <div className="score-grade" style={{ color: grade.color }}>{grade.letter}</div>
                    </div>

                    <div className="score-details">
                        <div className="score-stat">
                            <span className="stat-value">{summary.correctCount}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="score-divider"></div>
                        <div className="score-stat">
                            <span className="stat-value">{summary.totalCards - summary.correctCount}</span>
                            <span className="stat-label">Incorrect</span>
                        </div>
                        <div className="score-divider"></div>
                        <div className="score-stat">
                            <span className="stat-value">{summary.totalCards}</span>
                            <span className="stat-label">Total</span>
                        </div>
                    </div>
                </div>

                {/* Question Review */}
                {summary.questions && summary.questions.length > 0 && (
                    <div className="questions-review">
                        <h2>Review Your Answers</h2>
                        <div className="questions-list">
                            {summary.questions.map((q, index) => (
                                <div
                                    key={index}
                                    className={`question-review-card ${q.isCorrect ? 'correct' : 'incorrect'}`}
                                >
                                    <div className="review-card-header">
                                        <span className="question-number">#{index + 1}</span>
                                        <span className={`result-badge ${q.isCorrect ? 'badge-success' : 'badge-error'}`}>
                                            {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </span>
                                    </div>

                                    <div className="review-content">
                                        <div className="review-question">
                                            <strong>Q:</strong> {q.questionText}
                                        </div>

                                        <div className="review-answers">
                                            {!q.isCorrect && q.userAnswer && (
                                                <div className="user-answer">
                                                    <span className="answer-label">Your answer:</span>
                                                    <span className="answer-text wrong">{q.userAnswer}</span>
                                                </div>
                                            )}
                                            <div className="correct-answer">
                                                <span className="answer-label">Correct answer:</span>
                                                <span className="answer-text correct">{q.correctAnswer}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="results-actions">
                    <Link to={`/decks/${summary.deckId}`} className="btn btn-secondary btn-lg">
                        Back to Deck
                    </Link>
                    <Link to={`/study/${summary.deckId}`} className="btn btn-primary btn-lg">
                        Study Again
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResultsPage
