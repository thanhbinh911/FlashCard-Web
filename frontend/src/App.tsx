import React, { useEffect, useState } from "react"
import FlashcardList from "./FlashcardList"
import './app.css'
import axios from "axios"

function App() {

  const [FlashCard, setFlashCard] = useState(SAMPLE_FLASHCARD)


  useEffect(() => {
    axios
      .get('https://opentdb.com/api.php?amount=10')
      .then(response => {
        const flashcards = response.data.results.map((item: any, index: number) => ({
          id: index + 1,
          question: decodeString(item.question),
          answer: decodeString(item.correct_answer),
          options: item.incorrect_answers.map(decodeString)
            .concat(decodeString(item.correct_answer))
            .sort(() => Math.random() - 0.5)
        }))
        setFlashCard(flashcards)
      })
  }, [])

  return (
    <div className="container">
      <FlashcardList flashcards={FlashCard} />
    </div>
  )
}

function decodeString(str: string) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
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
