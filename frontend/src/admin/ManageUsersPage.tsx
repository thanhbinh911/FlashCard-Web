import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// Định nghĩa Interface dựa trên AdminUserResponse.java của bạn
interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  lastLogin: string;
  deckCount: number;
  totalStudySessions: number;
}

function ManageUsersPage() {
  const navigate = useNavigate();
  // Thay đổi state từ các biến đơn lẻ sang một mảng users
  const [users, setUsers] = React.useState<UserResponse[]>([]);

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
        // data ở đây là List<AdminUserResponse> từ Java
        if (Array.isArray(data)) {
          setUsers(data);
        }
      })
      .catch(err => console.error("Error fetching user data:", err));
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Manage Users</h2>
      <p>Users List</p>
      
      <table className="user-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Decks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.deckCount}</td>
              <td>
                <button 
                  onClick={() => navigate('/admin/manage-user-decks/' + user.id)}
                  className="btn-small"
                >
                  Manage Decks
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default ManageUsersPage