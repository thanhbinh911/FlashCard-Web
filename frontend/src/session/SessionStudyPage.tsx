import { use, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import type { Flashcard } from '../model/cardModel';
import { FaChevronLeft, FaChevronRight, FaSave } from 'react-icons/fa';
import FlashCard from '../flashcard/FlashCard';
import '../style/Session.css';

function SessionStudyPage() {
  const navigate = useNavigate();
  const sessionId = useParams().sessionId;
  const [timer, setTimer] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

  function fetchFlashcards() {
    fetch(`http://localhost:8080/api/decks/${sessionDetails.sessionId}/flashcards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {

        const results = data.map((item: any) => ({
          id: item.id,
          question: item.questionText,
          answer: item.answerText,

          options: item.hint ? [`Hint: ${item.hint}`] : []
        }))
        setFlashcards(results)
      })
      .catch(error => {
        console.error('Error fetching flashcards:', error)
      })
  }

  useEffect(() => {
    // Fetch session details and flashcards here using sessionId
    fetch(`http://localhost:8080/api/sessions/${sessionId}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setSessionDetails(data);
        setTimer(data.timeLimitSeconds);
        fetchFlashcards();
      })
      .catch(err => console.error("Error fetching flashcards:", err));
  }, [sessionId]);

  const handleInputChange = (value: string) => {
    const currentCardId = flashcards[currentIndex].id;
    setUserAnswers(prev => ({
      ...prev,
      [currentCardId]: value
    }));
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (flashcards.length === 0) return <div>Loading cards...</div>;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="session-page-container">
      <h2 className="page-title">
        Studying: <span style={{ color: 'var(--primary)' }}>{sessionDetails?.deckTitle || '...'}</span>
      </h2>

      <div className='card-slider'>
        <div className='slider-controls'>
          <button className='btn-nav' onClick={prevCard} disabled={currentIndex === 0}>
            <FaChevronLeft />
          </button>

          <div className='single-card-wrapper'>
            <FlashCard
              flashcard={currentCard}
              key={currentCard.id}
              isFlippable={false}
            />
          </div>

          <button className='btn-nav' onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>
            <FaChevronRight />
          </button>
        </div>
        <div className="card-counter">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>

      {/* Mục nhập câu trả lời mới */}
      <div className="answer-section">
        <label className="control-label">Your Answer:</label>
        <textarea
          className="answer-input"
          placeholder="Type your answer here to practice..."
          rows={3}
          value={userAnswers[currentCard.id] || ''}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <p className="detail-label" style={{ fontSize: '0.8rem' }}>
          (Click the card above to flip and check)
        </p>
      </div>

      <div className="study-controls">
        <button className="btn btn-outline" onClick={() => navigate('/active-session')}>
          ← Pause & Exit
        </button>
        <button className="btn btn-primary" onClick={() => console.log("Answers to save:", userAnswers)}>
          <FaSave /> Save Progress
        </button>
      </div>
    </div>
  )
}

export default SessionStudyPage