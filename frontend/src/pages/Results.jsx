import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAttempt, exportAttemptPDF } from '../utils/api';

function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Chargement des résultats pour tentative:', attemptId);
      
      const response = await getAttempt(attemptId);
      console.log('Résultats chargés:', response.data);
      setAttempt(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des résultats:', err);
      setError('Impossible de charger les résultats du quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await exportAttemptPDF(attemptId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resultat_quiz_${attemptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors de l\'export PDF', err);
      alert('Erreur lors du téléchargement du PDF');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Chargement des résultats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="error-message">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
          style={{ marginTop: '1rem' }}
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  if (!attempt || !attempt.answers || Object.keys(attempt.answers).length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Aucun résultat disponible pour cette tentative.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
          style={{ marginTop: '1rem' }}
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const percentage = attempt.score.toFixed(2);
  const isPassed = attempt.score >= 50;
  
  // Compter le nombre de réponses correctes
  const correctCount = Object.values(attempt.answers).filter(answer => answer.is_correct).length;
  const totalQuestions = Object.keys(attempt.answers).length;

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '16px',
        textAlign: 'center',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', marginBottom: '1rem' }}>
          {isPassed ? '🎉 Félicitations !' : '📚 Continuez vos efforts !'}
        </h1>
        <div style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold',
          margin: '1rem 0'
        }}>
          {percentage}%
        </div>
        <p style={{ 
          fontSize: '1.5rem',
          margin: '1rem 0',
          fontWeight: '500'
        }}>
          {correctCount} / {totalQuestions} réponses correctes
        </p>
        <p style={{ 
          fontSize: '1.2rem',
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          background: isPassed ? 'rgba(72, 187, 120, 0.3)' : 'rgba(245, 101, 101, 0.3)',
          borderRadius: '50px',
          display: 'inline-block'
        }}>
          {isPassed ? '✓ Quiz réussi' : '✗ Quiz échoué'}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <button 
          className="btn btn-primary" 
          onClick={handleExportPDF} 
          style={{ flex: 1, minWidth: '200px', padding: '1rem 1.5rem' }}
        >
          📄 Télécharger PDF
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/')} 
          style={{ flex: 1, minWidth: '200px', padding: '1rem 1.5rem' }}
        >
          🏠 Retour au tableau de bord
        </button>
      </div>

      <h2 style={{ 
        marginBottom: '1.5rem', 
        color: '#2d3748',
        fontSize: '1.8rem',
        borderBottom: '3px solid #667eea',
        paddingBottom: '0.5rem'
      }}>
        📋 Détails des réponses
      </h2>

      {Object.entries(attempt.answers).map(([questionId, result], index) => {
        const isCorrect = result.is_correct;
        
        return (
          <div 
            key={questionId} 
            style={{ 
              marginBottom: '1.5rem', 
              padding: '1.5rem', 
              background: 'white',
              borderRadius: '12px',
              border: `3px solid ${isCorrect ? '#48bb78' : '#f56565'}`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ 
                margin: 0, 
                color: '#2d3748',
                fontSize: '1.3rem'
              }}>
                Question {index + 1}
              </h3>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: isCorrect ? '#48bb78' : '#f56565',
                background: isCorrect ? '#c6f6d5' : '#fed7d7',
                padding: '0.5rem 1rem',
                borderRadius: '8px'
              }}>
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </div>
            </div>
            
            <div style={{ 
              padding: '1.2rem', 
              background: isCorrect ? '#c6f6d5' : '#fed7d7',
              borderRadius: '10px',
              marginBottom: '1rem',
              border: `2px solid ${isCorrect ? '#48bb78' : '#f56565'}`
            }}>
              <strong style={{ fontSize: '1.1rem' }}>Votre réponse : </strong>
              <span style={{ 
                color: isCorrect ? '#22543d' : '#742a2a',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {result.user_answer || 'Pas de réponse'}
              </span>
            </div>

            {!isCorrect && (
              <div style={{ 
                padding: '1.2rem', 
                background: '#c6f6d5',
                borderRadius: '10px',
                border: '2px solid #48bb78'
              }}>
                <strong style={{ fontSize: '1.1rem' }}>Bonne réponse : </strong>
                <span style={{ 
                  color: '#22543d',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  {result.correct_answer}
                </span>
              </div>
            )}

            {isCorrect && (
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: '#e6fffa',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#234e52',
                fontWeight: '500'
              }}>
                ⭐ +1 point
              </div>
            )}
          </div>
        );
      })}

      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        background: '#f7fafc',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
          Récapitulatif
        </h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
              {correctCount}
            </div>
            <div style={{ color: '#718096' }}>Réponses correctes</div>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f56565' }}>
              {totalQuestions - correctCount}
            </div>
            <div style={{ color: '#718096' }}>Réponses incorrectes</div>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
              {percentage}%
            </div>
            <div style={{ color: '#718096' }}>Score final</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/')}
          style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
        >
          ← Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}

export default Results;