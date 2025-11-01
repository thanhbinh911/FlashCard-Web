import React, { useEffect, useState } from "react"
import FlashcardList from "./FlashcardList"
import './app.css'
import axios from "axios"

function App() {

  const [FlashCard, setFlashCard] = useState([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])

  const categoryEl = React.useRef<HTMLSelectElement | null>(null)
  const amountEl = React.useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(response => {
        setCategories(response.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
    
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current?.value,
          category: categoryEl.current?.value
        }
      })
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
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => 
              <option value={category.id} key={category.id}>{category.name}</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number Of Questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={FlashCard} />
      </div>
    </>
  )
}

function decodeString(str: string) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
}

export default App
