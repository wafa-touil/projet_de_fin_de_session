import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttempts } from '../utils/api';

function StudentDashboard() {
  const [quizUrl, setQuizUrl] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await getAttempts();
        setAttempts(response.data); // adapter selon la structure reçue
      } catch (error) {
        console.error('Erreur récupération tentatives:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  // Accéder au quiz en collant l'URL (ex: http://localhost:5173/quiz/123)
  const handleGoToQuiz = () => {
    try {
      const url = new URL(quizUrl);
      const path = url.pathname; // extrait /quiz/123
      navigate(path);
    } catch {
       alert('URL invalide. Merci de coller une URL complète valide.');
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Dashboard Étudiant</h2>
      <div>
        <label>Collez l'URL du quiz à passer:</label>
        <input
          type="text"
          value={quizUrl}
          onChange={(e) => setQuizUrl(e.target.value)}
          placeholder="Ex: http://localhost:5173/quiz/123"
          style={{ width: '400px' }}
        />
        <button onClick={handleGoToQuiz}>Accéder au quiz</button>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Vos anciennes tentatives</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : attempts.length === 0 ? (
          <p>Aucune tentative enregistrée.</p>
        ) : (
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Date</th>
                <th>Score</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.quiz_title || attempt.quiz}</td>
                  <td>{new Date(attempt.started_at).toLocaleString()}</td>
                  <td>{attempt.score}</td>
                  <td>
                    <button onClick={() => navigate(`/results/${attempt.id}`)}>
                      Voir résultats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
