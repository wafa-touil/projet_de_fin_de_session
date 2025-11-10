import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 onClick={() => navigate('/')}>QuizMaster</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>Bonjour, {user.username}</span>
              <button onClick={onLogout}>Déconnexion</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')}>Connexion</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
