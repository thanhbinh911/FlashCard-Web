import React, { useState } from "react"
import FlashcardList from "./FlashcardList"
import './app.css'

function App() {

  const [FlashCard, setFlashCard] = useState(SAMPLE_FLASHCARD)

  return (
    <FlashcardList flashcards = {FlashCard} />
  )
}

const SAMPLE_FLASHCARD = [
  {
    id: 1,
    question: 'What is 4 *9',
    answer: '36',
    options: [
      '18', '36', '0', '100'
    ]
  },
  {
    id: 2,
    question: 'Questions 2',
    answer: 'Answer',
    options: [
      'Option 1', 'Option 2', 'Option 3', 'Option 4'
    ]
  }

]

export default App
