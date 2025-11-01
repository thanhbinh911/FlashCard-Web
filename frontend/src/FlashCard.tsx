import React from 'react'
import type { Flashcard } from './type'

interface FlashCardProps {
  flashcard: Flashcard
}

const FlashCard = ({ flashcard }: FlashCardProps) => {

  const [flip, setFlip] = React.useState(false)

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      onClick={() => setFlip(!flip)}
    >
      <div className='front'>
        <h2>{flashcard.question}</h2>
        <div className='flashcard-options'>
          {flashcard.options.map((option,index) => 
            <p className='card-option' key={`card${index}`}>{option}</p>)}
        </div>
      </div>
      <div className='back'>{flashcard.answer}</div>
    </div>
  )
}

export default FlashCard
