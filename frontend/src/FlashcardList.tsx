import FlashCard from './FlashCard'
import type { Flashcard } from './model/cardModel'

// Props: array of flashcards to render
interface FlashcardListProps {
  flashcards: Flashcard[]
}

const FlashcardList = ({ flashcards }: FlashcardListProps) => {
  return (
    // Grid container for flashcard items
    <div className='card-grid'>
      {flashcards.map(flashcard => {
          // Render each flashcard as a flip card
          return <FlashCard flashcard={flashcard} key={flashcard.id} />
        }
      )}
    </div>
  )
}

export default FlashcardList