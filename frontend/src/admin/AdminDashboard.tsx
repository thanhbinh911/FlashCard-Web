import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalDecks, setTotalDecks] = React.useState(0);
  const [totalFlashcards, setTotalFlashcards] = React.useState(0);
  const [totalStudySessions, setTotalStudySessions] = React.useState(0);
  const [activeSessionsCount, setActiveSessionsCount] = React.useState(0);
  const [recentActivities, setRecentActivities] = React.useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTotalUsers(data.totalUsers);
        setTotalDecks(data.totalDecks);
        setTotalFlashcards(data.totalFlashcards);
        setTotalStudySessions(data.totalStudySessions);
        setActiveSessionsCount(data.activeSessionsCount);
        setRecentActivities(data.recentActivities);
      })
      .catch(err => console.error("Error fetching admin dashboard data:", err));
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="page-title">Admin Dashboard</h2>
        <p>Welcome to the Admin Dashboard.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Decks</h3>
            <p>{totalDecks}</p>
          </div>
          <div className="stat-card">
            <h3>Total Flashcards</h3>
            <p>{totalFlashcards}</p>
          </div>
          <div className="stat-card">
            <h3>Total Study Sessions</h3>
            <p>{totalStudySessions}</p>
          </div>
          <div className="stat-card">
            <h3>Active Sessions</h3>
            <p>{activeSessionsCount}</p>
          </div>
          <div className="recent-activities">
            <h3>Recent Activities</h3>
            <ul>
              {recentActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin')}>
          Back to Admin Home
        </button>

      </div>
    </>
  )
}

export default AdminDashboard