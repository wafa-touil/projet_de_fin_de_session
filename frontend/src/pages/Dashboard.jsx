import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes } from '../utils/api';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getQuizzes();
      setQuizzes(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des quiz', err);
      setError('Impossible de charger vos quiz. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour copier le lien d'un quiz
  const copyQuizLink = async (quizId, event) => {
    if (event) {
      event.stopPropagation();
    }
    const url = `${window.location.origin}/quiz/${quizId}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopiedId(quizId);
        setCopyMessage('✅ Lien copié avec succès !');
        setTimeout(() => {
          setCopiedId(null);
          setCopyMessage('');
        }, 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          textArea.remove();
          if (successful) {
            setCopiedId(quizId);
            setCopyMessage('✅ Lien copié avec succès !');
            setTimeout(() => {
              setCopiedId(null);
              setCopyMessage('');
            }, 2000);
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          console.error('Erreur lors de la copie', err);
          textArea.remove();
          alert(`Copiez ce lien manuellement:\n\n${url}`);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la copie', err);
      setCopyMessage('❌ Erreur lors de la copie');
      setTimeout(() => setCopyMessage(''), 2000);
      alert(`Copiez ce lien manuellement:\n\n${url}`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Chargement de vos quiz...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ margin: 0 }}>Mes Quiz</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/quiz/create')}
            style={{ width: 'auto', padding: '0.8rem 1.5rem' }}
          >
            ➕ Créer un Quiz
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/stats')}
            style={{ width: 'auto', padding: '0.8rem 1.5rem' }}
          >
            📊 Mes Statistiques
          </button>
        </div>
      </div>

      {copyMessage && (
        <div style={{
          padding: '0.75rem 1.5rem',
          background: copyMessage.includes('✅') ? '#48bb78' : '#f56565',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.95rem',
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: '500',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          {copyMessage}
        </div>
      )}

      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {error}
          <button
            onClick={loadQuizzes}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Réessayer
          </button>
        </div>
      )}

      {quizzes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#f7fafc',
          borderRadius: '8px',
          border: '2px dashed #cbd5e0'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#718096', marginBottom: '1rem' }}>
            📝 Vous n'avez créé aucun quiz pour le moment
          </p>
          <p style={{ color: '#a0aec0', marginBottom: '1.5rem' }}>
            Créez votre premier quiz pour le partager avec vos étudiants !
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/quiz/create')}
            style={{ padding: '1rem 2rem' }}
          >
            Créer mon premier quiz
          </button>
        </div>
      ) : (
        <>
          <div style={{
            marginBottom: '1rem',
            color: '#718096',
            fontSize: '0.95rem'
          }}>
            {quizzes.length} quiz créé{quizzes.length > 1 ? 's' : ''}
          </div>

          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-card"
                style={{ cursor: 'pointer' }}
              >
                <div onClick={() => navigate(`/quiz/${quiz.id}`)}>
                  <h3>{quiz.title}</h3>
                  <p style={{ color: '#718096', minHeight: '3rem' }}>
                    {quiz.description || 'Aucune description'}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <span className={`badge badge-${quiz.difficulty}`}>
                      {quiz.difficulty === 'facile' ? '⏱️ Facile' : '⚡ Difficile'}
                    </span>
                    {quiz.tags && (
                      <span
                        className="badge"
                        style={{
                          background: '#e2e8f0',
                          color: '#2d3748',
                          marginLeft: '0.5rem'
                        }}
                      >
                        🏷️ {quiz.tags}
                      </span>
                    )}
                  </div>

                  <div className="quiz-meta" style={{ marginBottom: '1rem' }}>
                    <span>📝 {quiz.question_count} question{quiz.question_count > 1 ? 's' : ''}</span>
                    <span>⏰ {quiz.time_per_question}s / question</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '1rem'
                }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/quiz/${quiz.id}`)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    ▶️ Passer le quiz
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={(e) => copyQuizLink(quiz.id, e)}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      fontSize: '0.9rem',
                      background: copiedId === quiz.id ? '#48bb78' : '#4299e1',
                      color: 'white',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {copiedId === quiz.id ? '✅ Copié !' : '🔗 Copier le lien'}
                  </button>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  background: '#f7fafc',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#718096',
                  wordBreak: 'break-all',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: '#2d3748' }}>🔗 Lien à partager:</strong>
                  <br />
                  <code style={{
                    background: '#edf2f7',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    display: 'inline-block',
                    marginTop: '0.25rem',
                    color: '#4299e1'
                  }}>
                    {window.location.origin}/quiz/{quiz.id}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
