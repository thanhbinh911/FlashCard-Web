import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function ManageUsersPage() {
  const navigate = useNavigate();
  const [id, setId] = React.useState<number>(0);
  const [username, setUsername] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [role, setRole] = React.useState<string>('');
  const [lastLogin, setLastLogin] = React.useState<string>('');
  const [deckCount, setDeckCount] = React.useState<number>(0);
  const [totalStudySessions, setTotalStudySessions] = React.useState<number>(0);

  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setId(data.id);
        setUsername(data.username);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setRole(data.role);
        setLastLogin(data.lastLogin);
        setDeckCount(data.deckCount);
        setTotalStudySessions(data.totalStudySessions);
      })
      .catch(err => console.error("Error fetching user data:", err));
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="page-title">Manage Users</h2>
        <p>Welcome to the Manage Users Page.</p>
        <div className="user-details">
          <p><strong>User ID:</strong> {id}</p>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>First Name:</strong> {firstName}</p>
          <p><strong>Last Name:</strong> {lastName}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Last Login:</strong> {lastLogin}</p>
          <p><strong>Number of Decks:</strong> {deckCount}</p>
          <p><strong>Total Study Sessions:</strong> {totalStudySessions}</p>
        </div>
        <button onClick={() => navigate('/admin/manage-user-decks/' + id)}>Manage User's Decks</button>
        <button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</button>
      </div>
    </>
  )
}

export default ManageUsersPage