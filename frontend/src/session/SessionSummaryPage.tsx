import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaRedo } from 'react-icons/fa';
import '../style/Session.css';

function SessionSummaryPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/sessions/${sessionId}/summary`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="loading">Calculating results...</div>;
  if (!summary) return <div className="loading">Summary not found.</div>;

  const accuracy = summary.totalCards > 0 
    ? ((summary.correctCount / summary.totalCards) * 100).toFixed(1) 
    : 0;

  return (
    <div className="session-page-container">
      <h2 className="page-title">Session Complete!</h2>
      
      {/* Thống kê tổng quát */}
      <div className="session-card summary-header-card">
        <h3 className="deck-title-display">{summary.deckTitle}</h3>
        <div className="session-details-grid">
          <div className="detail-item">
            <span className="detail-label">Correct</span>
            <span className="detail-value text-success">{summary.correctCount} / {summary.totalCards}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Accuracy</span>
            <span className="detail-value">{accuracy}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mode</span>
            <span className="detail-value">{summary.isPracticeMode ? "Practice" : "Exam"}</span>
          </div>
        </div>
      </div>

      {/* Danh sách xem lại câu hỏi */}
      <div className="review-section">
        <h3 className="control-label">Review Your Answers:</h3>
        <div className="review-list">
          {summary.questions && summary.questions.map((q: any, index: number) => (
            <div key={index} className={`review-card ${q.isCorrect ? 'is-correct' : 'is-wrong'}`}>
              <div className="review-status">
                <span>Card {q.position}</span>
                {q.isCorrect ? <FaCheckCircle color="#2ecc71" /> : <FaTimesCircle color="#e74c3c" />}
              </div>
              
              <div className="review-content">
                <p className="review-q"><strong>Q:</strong> {q.question}</p>
                <p className="review-a">
                  <strong>Your Answer:</strong> 
                  <span className={q.isCorrect ? "text-success" : "text-danger"}>
                    {q.userAnswer || "No answer"}
                  </span>
                </p>
                {!q.isCorrect && (
                  <p className="review-correct">
                    <strong>Correct Answer:</strong> <span className="text-success">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Điều hướng */}
      <div className="study-controls">
        <button className="btn btn-outline" onClick={() => navigate('/active-session')}>
          <FaArrowLeft /> Back to Active Sessions
        </button>
      </div>
    </div>
  );
}

export default SessionSummaryPage;