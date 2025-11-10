import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../utils/api';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.clear();
      await register(formData);
      const loginResponse = await login({
        username: formData.username,
        password: formData.password
      });
      localStorage.setItem('token', loginResponse.data.access);
      if (loginResponse.data.refresh) {
        localStorage.setItem('refresh', loginResponse.data.refresh);
      }
      localStorage.setItem('username', formData.username);
      localStorage.setItem('role', formData.role);

      if (onLogin) {
        onLogin({ username: formData.username, role: formData.role });
      }
      navigate('/');
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.username) {
          setError(`Nom d'utilisateur: ${errorData.username[0]}`);
        } else if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Mot de passe: ${errorData.password[0]}`);
        } else {
          setError('Ce nom d\'utilisateur ou cet email existe déjà. Veuillez en choisir un autre.');
        }
      } else if (err.response?.status === 500) {
        setError('Erreur du serveur. Veuillez réessayer plus tard.');
      } else {
        setError('Erreur lors de l\'inscription. Veuillez vérifier vos informations et réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Choisissez un nom d'utilisateur unique"
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="votre.email@exemple.com"
          />
        </div>
        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Votre prénom"
          />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
            placeholder="Votre nom de famille"
          />
        </div>
        <div className="form-group">
          <label>Mot de passe *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Minimum 8 caractères"
            minLength={8}
          />
          <small style={{ color: '#718096', fontSize: '0.85rem' }}>
            Le mot de passe doit contenir au moins 8 caractères
          </small>
        </div>
        <div className="form-group">
          <label>Je suis *</label>
          <select name="role" value={formData.role} onChange={handleChange} disabled={loading}>
            <option value="teacher">Enseignant</option>
            <option value="student">Étudiant</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
      <div className="link" onClick={() => !loading && navigate('/login')}>
        Déjà un compte ? Connectez-vous
      </div>
    </div>
  );
}

export default Register;
