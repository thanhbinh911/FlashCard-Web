import React from 'react'

function YourDeckPage() {

  const [question, setQuestion] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const [options1, setOptions1] = React.useState('')
  const [options2, setOptions2] = React.useState('')
  const [options3, setOptions3] = React.useState('')
  const [options4, setOptions4] = React.useState('')

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Logic to add a new card to the deck goes here
  }

  return (
    <div className="your-deck-page">
      <h2>Your Decks</h2>
      {/* Logic to display user's decks goes here */}
      <form className='card-form' onSubmit={handleAddCard}>
        <div className="form-group">
          <label htmlFor="cardQuestion" className="form-label">Card Question</label>
          <input
            type="text"
            id="cardQuestion"
            className="form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Enter card question"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardAnswer" className="form-label">Card Answer</label>
          <input
            type="text"
            id="cardAnswer"
            className="form-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            placeholder="Enter card answer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardOptions" className="form-label">Card Options </label>
          <input
            type="text"
            id="cardOptions1"
            className="form-input"
            value={options1}
            onChange={(e) => setOptions1(e.target.value)}
            required
            placeholder="Enter card options"
          />
          <input
            type="text"
            id="cardOptions2"
            className="form-input"
            value={options2}
            onChange={(e) => setOptions2(e.target.value)}
            required
            placeholder="Enter card options"
          />
          <input
            type="text"
            id="cardOptions3"
            className="form-input"
            value={options3}
            onChange={(e) => setOptions3(e.target.value)}
            required
            placeholder="Enter card options"
          />
          <input
            type="text"
            id="cardOptions4"
            className="form-input"
            value={options4}
            onChange={(e) => setOptions4(e.target.value)}
            required
            placeholder="Enter card options"
          />
        </div>
        <button className="btn" type="submit">Add Card</button>
      </form>
    </div>
  )
}

export default YourDeckPage
