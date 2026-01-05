import React, { useEffect, useState } from "react"
import FlashcardList from "../flashcard/FlashcardList"
import Navbar from "../Navbar"
import axios from "axios"
import { FaMagic, FaLayerGroup, FaListOl } from 'react-icons/fa' 

function FlashcardPage() {
  // Generated flashcards for the current session
  const [flashcards, setFlashcards] = useState([])
  // Available categories fetched from OpenTDB
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])
  // Form controls: selected category and desired quantity
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState(10)
  // Submit loading state
  const [loading, setLoading] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(response => {
        setCategories(response.data.trivia_categories)
      })
      .catch(err => console.error("Error loading categories:", err))
  }, [])

  // Restore prior session selections and cards from sessionStorage
  useEffect(() => {
    const savedCards = sessionStorage.getItem('flashcards')
    const savedCategory = sessionStorage.getItem('category')
    const savedAmount = sessionStorage.getItem('amount')

    if (savedCategory) setCategory(savedCategory)
    if (savedAmount) setAmount(Number(savedAmount))
    if (savedCards) setFlashcards(JSON.parse(savedCards))
  }, [])

  // Default category to the first available if none selected
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(String(categories[0].id))
    }
  }, [categories, category])

  // Submit: request boolean-type questions from OpenTDB
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setFlashcards([]) 

    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount,
          category,
          timestamp: Date.now() 
        }
      })
      .then(response => {
        // Map API results to app-friendly flashcard structure
        const results = response.data.results.map((item: any, index: number) => ({
          id: index + 1,
          question: decodeString(item.question),
          answer: decodeString(item.correct_answer),
          options: item.incorrect_answers.map(decodeString)
            .concat(decodeString(item.correct_answer))
            .sort(() => Math.random() - 0.5)
        }))
        
        setFlashcards(results)
        // Persist current state in sessionStorage
        sessionStorage.setItem('flashcards', JSON.stringify(results))
        sessionStorage.setItem('category', category || '')
        sessionStorage.setItem('amount', String(amount))
      })
      .catch(err => {
        console.error(err)
        // TODO: replace alert with inline toast/notification component
        alert("Failed to generate cards. Please try again.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Navbar />
      
      <div className="container">
        {/* Controls: category and quantity selector */}
        <form className="controls-header" onSubmit={handleSubmit}>
          

          <div className="control-group">
           
            <label className="control-label" htmlFor="category" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <FaLayerGroup /> 
              <span>Topic Category</span>
            </label>
            <select 
              id="category" 
              className="form-select"
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => 
                <option value={cat.id} key={cat.id}>{cat.name}</option>
              )}
            </select>
          </div>

       
          <div className="control-group">
 
            <label className="control-label" htmlFor="amount" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <FaListOl /> 
              <span>Quantity</span>
            </label>
            <input 
              type="number" 
              id="amount" 
              className="form-input"
              min="1" max="50" step="1" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))} 
            />
          </div>


          {/* Generate button: shows loading state while fetching */}
          <div style={{marginBottom: '2px'}}> 
            <button className="btn" disabled={loading} style={{height: '42px', minWidth: '160px'}}>
              {loading ? (
                 <>Generating...</>
              ) : (
              
                 <><FaMagic /> Generate Cards</>
              )}
            </button>
          </div>
        </form>

        {/* Main content: either loader, results list, or empty state */}
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : (
          flashcards.length > 0 ? (
            <FlashcardList flashcards={flashcards} />
          ) : (
            <div className="empty-state">
              <h3>Start Your Practice!</h3>
              <p>Select a topic above and click <b>Generate Cards</b> to begin learning.</p>
            </div>
          )
        )}
      </div>
    </>
  )
}

// Decode HTML entities returned by OpenTDB into readable text
function decodeString(str: string) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = str
  return textArea.value
}

export default FlashcardPage