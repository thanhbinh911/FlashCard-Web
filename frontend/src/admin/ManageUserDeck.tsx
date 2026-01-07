import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho Deck
interface DeckResponse {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  ownerUsername: string;
  cardCount: number;
  isPublic: boolean;
  createdAt: string;
}

function ManageUserDeck() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [decks, setDecks] = React.useState<DeckResponse[]>([]);

  useEffect(() => {
    // Sửa lỗi http:// tại đây
    fetch(`http://localhost:8080/api/admin/users/${userId}/decks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        // data là List<AdminDeckResponse> từ Java
        setDecks(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching user decks:", err));
  }, [userId]);

  return (
    <div className="container">
      <h2 className="page-title">Manage User's Decks</h2>
      <p>Danh sách bộ thẻ của người dùng ID: {userId}</p>
      
      {decks.length === 0 ? (
        <p>Người dùng này chưa có bộ thẻ nào.</p>
      ) : (
        <div className="stats-grid">
          {decks.map(deck => (
            <div key={deck.id} className="stat-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
              <h3>{deck.title}</h3>
              <p><strong>Mô tả:</strong> {deck.description}</p>
              <p><strong>Số thẻ:</strong> {deck.cardCount}</p>
              <p><strong>Trạng thái:</strong> {deck.isPublic ? 'Công khai' : 'Riêng tư'}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/admin/manage-user-deck-flashcards/${userId}/${deck.title}/${deck.id}`)}
              >
                Manage Flashcards
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/admin/manage-users')}>Back to Manage Users</button>
        <button onClick={() => navigate('/admin')}>Back to Admin Home</button>
      </div>
    </div>
  )
}

export default ManageUserDeck