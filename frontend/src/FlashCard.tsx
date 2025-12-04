import React from 'react'
import type { Flashcard } from './model/cardModel'

// Props: a single flashcard item to display
interface FlashCardProps {
  flashcard: Flashcard
}

const FlashCard = ({ flashcard }: FlashCardProps) => {
  // Local state: whether the card is flipped to show the answer
  const [flip, setFlip] = React.useState(false)

  return (
    // Card container: toggles flip on click
    <div 
      className={`card ${flip ? 'flip' : ''}`} 
      onClick={() => setFlip(!flip)}
    >
      <div className="card-inner">

        {/* Front face: question and options */}
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


        {/* Back face: correct answer */}
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