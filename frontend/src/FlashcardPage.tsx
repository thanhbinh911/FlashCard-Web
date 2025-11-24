import React, { useEffect, useState } from "react"
import FlashcardList from "./FlashcardList"
import './style/App.css'
import axios from "axios"
import { useNavigate } from "react-router-dom"

function FlashcardPage() {
  const navigate = useNavigate()

  const [FlashCard, setFlashCard] = useState([])
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(response => {
        setCategories(response.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
  const savedCards = sessionStorage.getItem('flashcards')
  const savedCategory = sessionStorage.getItem('category')
  const savedAmount = sessionStorage.getItem('amount')

  if (savedCategory) setCategory(savedCategory)
  if (savedAmount) setAmount(Number(savedAmount))
  if (savedCards) setFlashCard(JSON.parse(savedCards))
}, [])

useEffect(() => {
  if (categories.length > 0 && !category) {
    setCategory(String(categories[0].id))
  }
}, [categories])


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount,
          category,
          timestamp: Date.now()
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
        sessionStorage.setItem('flashcards', JSON.stringify(flashcards))
        sessionStorage.setItem('category', category || '')
        sessionStorage.setItem('amount', JSON.stringify(amount) || '')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <button className="To-Login-Btn" onClick={() => navigate('/')}>To Login</button>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(category => 
              <option value={category.id} key={category.id}>{category.name}</option>
            )}

          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number Of Questions</label>
          <input type="number" id="amount" min="1" step="1" value={amount} defaultValue={10} onChange={e => 
            setAmount(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <button className="btn" disabled={loading}>
            {loading ? 'Loading...' : 'Generate'}
          </button>
        </div>
        <div className="form-group">
          <button className="btn" onClick={() => navigate('create-deck')}>Create Deck</button>
        </div>
        <div>
          <button className="btn" onClick={() => navigate('your-deck')}>Your Deck</button>
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

export default FlashcardPage
