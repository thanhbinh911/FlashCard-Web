import React from 'react'
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <h2 className="page-title">Admin Dashboard</h2>
        <div className="admin-controls">
          <button className="btn btn-primary" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/manage-users')}>
            Manage Users
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/flashcards')}>Back to Home page</button>
        </div>
      </div>
    </>
  )
}

export default AdminPage