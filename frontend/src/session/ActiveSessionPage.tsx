import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Session from './Session';

function ActiveSessionPage() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = React.useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/sessions/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Handle active session data
        setSessionData(data);
        console.log(data);
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      <h2 className="page-title" style={{ marginBottom: '1.5rem' }}>Active Session</h2>
      <div>
        {sessionData ? (
          <Session session={sessionData} />
        ) : (
          <p>No active session found.</p>
        )}
      </div>
    </>
  )
}

export default ActiveSessionPage