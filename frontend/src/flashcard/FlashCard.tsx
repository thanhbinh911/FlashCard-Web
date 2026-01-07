// FlashCard.tsx
import React from 'react'
import type { Flashcard } from '../model/cardModel'

interface FlashCardProps {
  flashcard: Flashcard
  isFlippable?: boolean 
}

const FlashCard = ({ flashcard, isFlippable = true }: FlashCardProps) => { // Mặc định là true
  const [flip, setFlip] = React.useState(false)

  const handleFlip = () => {
    if (isFlippable) { 
      setFlip(!flip)
    }
  }

  return (
    <div 
      className={`card ${flip ? 'flip' : ''} ${!isFlippable ? 'no-cursor' : ''}`} 
      onClick={handleFlip}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-content">
            <h3>{flashcard.question}</h3>
            <div className="flashcard-options">
              {flashcard.options.map((option, index) => 
                <div className="card-option" key={index}>{option}</div>
              )}
            </div>
          </div>
        </div>

        <div className="card-back">
          <div className="card-content">
            {flashcard.answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashCard