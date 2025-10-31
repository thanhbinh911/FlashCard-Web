//import React from 'react'
import FlashCard from './FlashCard'
import type { Flashcard } from './type'

interface FlashcardListProps {
  flashcards: Flashcard[]
}

const FlashcardList = ({ flashcards }: FlashcardListProps) => {
  return (
    <div className='card-grid'>
      {flashcards.map(flashcard => {
          return <FlashCard flashcard = {flashcard}
          key = {flashcard.id}/>
        }
      )}
    </div>
  )
}

export default FlashcardList
