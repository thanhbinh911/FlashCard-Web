import { useNavigate, useLocation } from 'react-router-dom';

import { FaLayerGroup, FaPlusCircle, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  // Router helpers for navigation and current route detection
  const navigate = useNavigate();
  const location = useLocation(); 
  // Display name pulled from localStorage (fallback to "User")
  const username = localStorage.getItem('username') || 'User';

  // Clear session data and return to landing page
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Determine active link styling by matching current path
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/flashcards')}>

        <span style={{color: '#3498db'}}>
          FlashCard Web
        </span>
      </div>
      
      <div className="nav-links">
        {/* Practice route */}
        <div className={`nav-link ${isActive('/flashcards')}`} onClick={() => navigate('/flashcards')}>
          <FaLayerGroup /> Practice
        </div>
        {/* User decks route */}
        <div className={`nav-link ${isActive('/your-deck')}`} onClick={() => navigate('/your-deck')}>
          <FaUserCircle /> My Decks
        </div>
        {/* Create new deck route */}
        <div className={`nav-link ${isActive('/create-deck')}`} onClick={() => navigate('/create-deck')}>
          <FaPlusCircle /> Create
        </div>
        <div className={`nav-link ${isActive('/active-session')}`} onClick={() => navigate('/active-session')}>
          <FaPlusCircle /> Session
        </div>
      </div>

      {/* Right section: avatar, username, and logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555', fontWeight: '600'}}>
          <img 
            src={`https://ui-avatars.com/api/?name=${username}&background=random&color=fff`} 
            alt="Avatar" 
            style={{width: '32px', height: '32px', borderRadius: '50%'}}
            onClick={() => navigate('/account')}
          />
          <span>{username}</span>
        </div>
        <button className="btn btn-outline" style={{padding: '0.4rem 0.8rem'}} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;