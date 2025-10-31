import React from 'react'
import type { Flashcard } from './type'

interface FlashCardProps {
  flashcard: Flashcard
}

const FlashCard = ({ flashcard }: FlashCardProps) => {

  const [flip, setFlip] = React.useState(false)

  return (
    <div onClick={() => setFlip(!flip)}>
      {flip ? 
      <div>
        <h2>{flashcard.question}</h2>
        {flashcard.answer}
      </div> : 
      <div>
        <h2>{flashcard.question}</h2>
        {flashcard.options.map((option,index) => 
          <p key={index}>{option}</p>)}
      </div>}
    </div>
  )
}

export default FlashCard
