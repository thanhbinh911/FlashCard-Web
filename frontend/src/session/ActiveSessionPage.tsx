import { useEffect, useState } from 'react';
import Session from './Session';
import '../style/Session.css';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';

function ActiveSessionPage() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/sessions/active', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    })
      .then(res => res.status === 204 ? null : res.json())
      .then(data => {
        setSessionData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching active session:", err);
        setLoading(false);
      });
  };

  const handleDeleteSession = () => {
    const idToDelete = sessionData?.sessionId;
    
    if (!idToDelete) return;

    if (window.confirm("Are you sure you want to abandon this session? Progress will not be saved.")) {
      fetch(`http://localhost:8080/api/sessions/${idToDelete}/abandon`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      })
        .then(res => {
          if (res.ok) {
            setSessionData(null);
            alert("Session abandoned successfully.");
          } else if (res.status === 401) {
            alert("Session expired. Please login again.");
          } else {
            alert("Failed to abandon session. Please try again.");
          }
        })
        .catch(err => console.error("Error abandoning session:", err));
    }
  };

  return (
    <div className="session-page-container">
      <h2 className="page-title">Learning Status</h2>
      
      <div className="session-card">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#747d8c' }}>Loading session details...</p>
        ) : sessionData ? (
          <>
            <Session session={sessionData} />
            <button className='btn btn-danger' onClick={handleDeleteSession}>
              <FaTrashAlt /> Abandon Session
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#747d8c', marginBottom: '20px' }}>No active session found. Ready to start a new one?</p>
            <button className="btn btn-primary" onClick={() => navigate('/create-session')}>
              <FaPlus /> Create New Session
            </button>
          </div>
        )}
      </div>

      {sessionData && (
        <button className="btn btn-outline" onClick={() => navigate('/flashcards')}>
          Back to home page
        </button>
      )}
    </div>
  );
}

export default ActiveSessionPage;