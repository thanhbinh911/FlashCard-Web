import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSave, FaClock } from 'react-icons/fa'; // Thêm icon đồng hồ
import FlashCard from '../flashcard/FlashCard';
import '../style/Session.css';

function SessionStudyPage() {
  const navigate = useNavigate();
  const { sessionId, deckId, deckTitle } = useParams();
  const [timer, setTimer] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem(`session-${sessionId}-currentIndex`);
    return saved ? Number(saved) : 0;
  });

  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>(() => {
    const saved = localStorage.getItem(`session-${sessionId}-answers`);
    return saved ? JSON.parse(saved) : {};
  });
  // Logic đếm ngược thời gian
  useEffect(() => {
    if (timer < 0) return;
    if (timer === 0 && flashcards.length > 0) {
        handleSubmit(); 
        return;
    }

    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, flashcards.length]);

  // Định dạng giây thành MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  function fetchFlashcards() {
    fetch(`http://localhost:8080/api/decks/${deckId}/flashcards`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const results = data.map((item: any) => ({
          id: item.id,
          question: item.questionText,
          answer: item.answerText,
          options: item.hint ? [`Hint: ${item.hint}`] : []
        }));
        setFlashcards(results);
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetch(`http://localhost:8080/api/sessions/${sessionId}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const localTime = localStorage.getItem(`session-${sessionId}-remainingSeconds`);
        const remainingSeconds = localTime ? Number(localTime) : data.timeLimitSeconds;
        setTimer(remainingSeconds);
        fetchFlashcards();
      })
      .catch(err => console.error(err));
  }, [sessionId]);

  const handleInputChange = (value: string) => {
    const currentCardId = flashcards[currentIndex].id;
    setUserAnswers(prev => ({ ...prev, [currentCardId]: value }));
  };

  const nextCard = () => { if (currentIndex < flashcards.length - 1) setCurrentIndex(currentIndex + 1); };
  const prevCard = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  if (flashcards.length === 0) return <div className="loading">Loading cards...</div>;

  const currentCard = flashcards[currentIndex];

  function handleSubmit() {

    const formattedAnswers = Object.entries(userAnswers).map(([id, answer]) => ({
      flashcardId: parseInt(id),
      userAnswer: answer
    }));


    fetch(`http://localhost:8080/api/sessions/${sessionId}/finish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ answers: formattedAnswers }) // Backend mong đợi object chứa list 'answers'
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Failed to finish session');
      })
      .then(data => {
        console.log("Session finished result:", data);
        localStorage.removeItem(`session-${sessionId}-answers`);
        localStorage.removeItem(`session-${sessionId}-currentIndex`);
        localStorage.removeItem(`session-${sessionId}-remainingSeconds`);
        alert(`Session finished! You scored ${data.correctCount}/${data.totalCards}.`);
        navigate(`/session/${sessionId}/summary`);
      })
      .catch(err => console.error("Error finishing session:", err));
  };

  function handleSaveProgress() {
    fetch(`http://localhost:8080/api/sessions/${sessionId}/save-progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ remainingSeconds: timer })
    })
      .then(res => {
        if (res.ok) {
          localStorage.setItem(`session-${sessionId}-answers`, JSON.stringify(userAnswers));
          localStorage.setItem(`session-${sessionId}-currentIndex`, currentIndex.toString());
          localStorage.setItem(`session-${sessionId}-remainingSeconds`, timer.toString());
          alert("Progress saved successfully.");
          navigate('/active-session');
        }
      })
      .catch(err => console.error("Error saving progress:", err));
  };

  return (
    <div className="session-page-container">
      <div className={`timer-container ${timer < 60 ? 'timer-low' : ''}`}>
        <FaClock /> <span>{formatTime(timer)}</span>
      </div>

      <h2 className="page-title">
        Studying: <span style={{ color: 'var(--primary)' }}>{deckTitle}</span>
      </h2>

      <div className='card-slider'>
        <div className='slider-controls'>
          <button className='btn-nav' onClick={prevCard} disabled={currentIndex === 0}>
            <FaChevronLeft />
          </button>
          <div className='single-card-wrapper'>
            <FlashCard flashcard={currentCard} key={currentCard.id} isFlippable={false} />
          </div>
          <button className='btn-nav' onClick={nextCard} disabled={currentIndex === flashcards.length - 1}>
            <FaChevronRight />
          </button>
        </div>
        <div className="card-counter">Card {currentIndex + 1} of {flashcards.length}</div>
      </div>

      <div className="answer-section">
        <label className="control-label">YOUR ANSWER:</label>
        <textarea
          className="answer-input"
          placeholder="Type your answer here..."
          rows={2}
          value={userAnswers[currentCard.id] || ''}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>

      <div className="study-controls">
        <button
          className="btn btn-outline"
          onClick={handleSaveProgress}
        >
          <FaSave /> Save Progress
        </button>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
}

export default SessionStudyPage;