import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
      <h2>Accès refusé</h2>
      <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
      <button onClick={() => navigate(-1)}>Revenir en arrière</button>
    </div>
  );
}

export default NotAuthorized;
