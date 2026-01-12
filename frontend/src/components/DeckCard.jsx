import { Link } from 'react-router-dom'
import './DeckCard.css'

function DeckCard({ deck }) {
    const { id, title, description, flashcardCount, publicDeck, ownerUsername } = deck

    return (
        <Link to={`/decks/${id}`} className="deck-card">
            <div className="deck-card-header">
                <h3 className="deck-card-title">{title}</h3>
                <div className="deck-card-badges">
                    {publicDeck ? (
                        <span className="badge badge-success">Public</span>
                    ) : (
                        <span className="badge">Private</span>
                    )}
                </div>
            </div>

            <p className="deck-card-description">
                {description || 'No description provided'}
            </p>

            <div className="deck-card-footer">
                <div className="deck-card-stats">
                    <span className="stat">
                        <span className="stat-icon">📇</span>
                        {flashcardCount || 0} cards
                    </span>
                </div>
                {ownerUsername && (
                    <span className="deck-card-author">by {ownerUsername}</span>
                )}
            </div>
        </Link>
    )
}

export default DeckCard
