import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FlashCard from '../flashcard/FlashCard' // Import component hiển thị 1 thẻ
import type { Flashcard } from '../model/cardModel'
import './style/App.css' 

// DATA MẪU (Giữ nguyên hoặc thay đổi tùy ý)
const MOCK_DATA: Record<string, Flashcard[]> = {
  "1": [ 
    { id: 1, question: "Ambiguous", answer: "Open to more than one interpretation; having a double meaning.", options: ["Clear", "Ambiguous", "Distinct", "Vague"] },
    { id: 2, question: "Ephemeral", answer: "Lasting for a very short time.", options: ["Eternal", "Ephemeral", "Solid", "Long-term"] },
    { id: 3, question: "Serendipity", answer: "The occurrence and development of events by chance in a happy or beneficial way.", options: ["Bad Luck", "Serendipity", "Planning", "Disaster"] },
  ],
  "2": [
    { id: 4, question: "What is JSX?", answer: "Syntax extension for JavaScript.", options: ["HTML", "JSX", "CSS", "Python"] },
    { id: 5, question: "What is a Hook?", answer: "Functions that let you hook into React state/lifecycle features.", options: ["Class", "Hook", "Loop", "Array"] },
  ],
  "default": []
}

function StudyDeckPage() {
  const { deckId } = useParams()
  const navigate = useNavigate()
  
  const [cards, setCards] = useState<Flashcard[]>([])
  const [deckTitle, setDeckTitle] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0) // State để theo dõi thẻ hiện tại

  useEffect(() => {
    // Giả lập fetch data
    const data = MOCK_DATA[deckId || ""] || MOCK_DATA["default"]
    setCards(data)
    setCurrentIndex(0) // Reset về thẻ đầu tiên khi đổi bộ

    if(deckId === "1") setDeckTitle("English Vocabulary")
    else if(deckId === "2") setDeckTitle("ReactJS Interview")
    else setDeckTitle("Flashcard Study")
  }, [deckId])

  // Hàm chuyển thẻ
  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(curr => curr + 1)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1)
    }
  }

  return (
    <div className="study-page-container">
      {/* Header nhỏ cho trang học */}
      <div className="header" style={{justifyContent: 'flex-start', gap: '1rem'}}>
        <button className="btn" onClick={() => navigate('/your-deck')}>
          &larr; Back
        </button>
        <h3>{deckTitle}</h3>
      </div>

      <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem'}}>
        
        {cards.length > 0 ? (
          <>
            {/* Thanh tiến độ & Số thứ tự */}
            <div style={{width: '100%', maxWidth: '500px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: '#555'}}>
              <span>Card {currentIndex + 1} / {cards.length}</span>
              <span>{Math.round(((currentIndex + 1) / cards.length) * 100)}% completed</span>
            </div>

            {/* Hiển thị thẻ hiện tại */}
            <div style={{width: '100%', maxWidth: '600px'}}>
              <FlashCard flashcard={cards[currentIndex]} />
            </div>

            {/* Nút điều hướng */}
            <div className="navigation-buttons" style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
              <button 
                className="btn" 
                onClick={prevCard} 
                disabled={currentIndex === 0}
                style={{opacity: currentIndex === 0 ? 0.5 : 1}}
              >
                Previous
              </button>
              
              <button 
                className="btn-primary" // Dùng class btn-primary của bạn cho đẹp
                onClick={nextCard}
                disabled={currentIndex === cards.length - 1}
                style={{opacity: currentIndex === cards.length - 1 ? 0.5 : 1}}
              >
                Next Card
              </button>
            </div>
          </>
        ) : (
          <div style={{textAlign: 'center', marginTop: '3rem'}}>
            <p>This deck is empty.</p>
            <button className="btn" onClick={() => navigate('/create-deck')}>Add Cards</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyDeckPage