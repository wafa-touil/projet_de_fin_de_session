import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      localStorage.clear();
      const response = await login(formData);
      console.log('Login response:', response.data);  // Debug vérification rôle

      localStorage.setItem('token', response.data.access);
      if (response.data.refresh) localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('username', formData.username);

      if (response.data.role) {
        localStorage.setItem('role', response.data.role);
        onLogin({ username: formData.username, role: response.data.role });
      } else {
        const defaultRole = 'student';
        localStorage.setItem('role', defaultRole);
        onLogin({ username: formData.username, role: defaultRole });
      }

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <div className="link" onClick={() => navigate('/register')}>
        Pas encore de compte ? Inscrivez-vous
      </div>
    </div>
  );
}

export default Login;