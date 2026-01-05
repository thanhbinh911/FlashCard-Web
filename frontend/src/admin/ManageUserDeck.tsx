import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function ManageUserDeck() {
  const navigate = useNavigate();
  const { userId } = useParams()

  const [id, setId] = React.useState<number>(Number(userId));
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [ownerId, setOwnerId] = React.useState<number>(0);
  const [ownerUsername, setOwnerUsername] = React.useState<string>('');
  const [cardCount, setCardCount] = React.useState<number>(0);
  const [isPublic, setIsPublic] = React.useState<boolean>(false);
  const [createdAt, setCreatedAt] = React.useState<string>('');

  useEffect(() => {
    fetch(`http:localhost:8080/api/admin/users/${userId}/decks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setOwnerId(data.ownerId);
        setOwnerUsername(data.ownerUsername);
        setCardCount(data.cardCount);
        setIsPublic(data.isPublic);
        setCreatedAt(data.createdAt);
      })
      .catch(err => console.error("Error fetching user decks:", err));
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="page-title">Manage User's Decks</h2>
        <p>Welcome to the Manage User Decks Page.</p>
        <div className="deck-details">
          <p><strong>Deck ID:</strong> {id}</p>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Owner ID:</strong> {ownerId}</p>
          <p><strong>Owner Username:</strong> {ownerUsername}</p>
          <p><strong>Card Count:</strong> {cardCount}</p>
          <p><strong>Is Public:</strong> {isPublic ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {createdAt}</p>
        </div>
        <button onClick={() => navigate(`/admin/manage-user-deck-flashcards/${userId}/${title}/${id}`)}>Manage Deck's Flashcards</button>
        <button onClick={() => navigate('/admin/manage-users')}>Back to Manage Users</button>
        <button onClick={() => navigate('/admin')}>Back to Admin Home</button>
      </div>
    </>
  )
}

export default ManageUserDeck