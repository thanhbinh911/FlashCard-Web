
import type { deck } from './model/deckModel'
import { FaBook, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

// Props: a single deck instance to render
interface DeckProps {
  deck: deck
}

const Deck = ({ deck }: DeckProps) => {
  const navigate = useNavigate();

  // Handle card click: navigate to deck details (currently logs id)
  const handleClick = () => {
    navigate(`/decks/${deck.id}`) 
  }

  return (
    // Clickable deck card container
    <div className="deck-card" onClick={handleClick}>
      {/* Icon representing a deck */}
      <div className="deck-icon-wrapper">
        <FaBook size={28} color="#3498db" />
      </div>
      
      {/* Content: title and description */}
      <div className="deck-content">
        <h3 className="deck-title">{deck.title}</h3>

        <p className="deck-desc">

          Tap to start practicing this deck.
        </p>
      </div>

      {/* Footer: type badge and right arrow */}
      <div className="deck-footer">
        <span className="deck-badge">Flashcards</span>
        <FaArrowRight size={14} color="#bdc3c7" />
      </div>
    </div>
  )
}

export default Deck   