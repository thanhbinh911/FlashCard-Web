import FlashCard from './FlashCard'
import type { Flashcard } from '../model/cardModel'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Props: array of flashcards to render
interface FlashcardListProps {
  flashcards: Flashcard[]
}

const FlashcardList = ({ flashcards }: FlashcardListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }
  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) setCurrentIndex(currentIndex + 1)
  }
  return (
    // Grid container for flashcard items
    <div className='card-slider'>
      <div className='slider-controls'>
        <button className='btn-nav' onClick={prevCard} disabled={currentIndex === 0}>
          <FaChevronLeft />
        </button>
        <div className='single-card-wrapper'>
          <FlashCard flashcard={flashcards[currentIndex]} key={flashcards[currentIndex].id} />
        </div>
        <button className='btn-nav' onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>
          <FaChevronRight />
        </button>
      </div>
      <div className="card-counter">
        Card {currentIndex + 1} of {flashcards.length}
      </div>
    </div>
  )
}

export default FlashcardList