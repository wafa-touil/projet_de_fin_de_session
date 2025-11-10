import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicQuiz, createAttempt, submitAttempt } from '../utils/api';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && quiz && !isSubmitting) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !isSubmitting && currentQuestion < quiz.questions.length) {
      handleNext();
    }
  }, [timeLeft, quiz, isSubmitting]);

  const getTimeForQuestion = (quizData) => {
    // 15 secondes pour difficile, 30 secondes pour facile
    return quizData.difficulty === 'hard' ? 15 : 30;
  };

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Chargement du quiz avec ID:', id);
      const quizResponse = await getPublicQuiz(id);
      console.log('Quiz chargé:', quizResponse.data);
      setQuiz(quizResponse.data);
      
      console.log('Création de la tentative pour quiz ID:', id);
      const attemptResponse = await createAttempt(id);
      console.log('Tentative créée:', attemptResponse.data);
      console.log('Tentative ID:', attemptResponse.data.id);
      
      // IMPORTANT: Vérifier que l'ID existe
      if (!attemptResponse.data.id) {
        throw new Error('La tentative n\'a pas d\'ID');
      }
      
      setAttempt(attemptResponse.data);
      setTimeLeft(getTimeForQuestion(quizResponse.data));
    } catch (err) {
      console.error('Erreur lors du chargement du quiz:', err);
      console.error('Détails:', err.response?.data);
      setError('Impossible de charger ce quiz. Vérifiez que le lien est correct.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    if (!quiz || isSubmitting) return;

    const questionId = quiz.questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (isSubmitting) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(getTimeForQuestion(quiz));
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0 && !isSubmitting) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(getTimeForQuestion(quiz));
    }
  };

  const handleSubmit = async () => {
    if (!attempt) {
      setError('Aucune tentative active. Veuillez recharger la page.');
      return;
    }

    if (!attempt.id) {
      setError('ID de tentative invalide. Veuillez recharger la page.');
      console.error('Attempt object:', attempt);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers = {};
      Object.keys(answers).forEach(key => {
        formattedAnswers[String(key)] = String(answers[key]);
      });

      console.log('=== SOUMISSION DU QUIZ ===');
      console.log('Attempt ID:', attempt.id);
      console.log('Réponses formatées:', formattedAnswers);

      const response = await submitAttempt(attempt.id, formattedAnswers);
      console.log('Réponse de soumission:', response.data);
      
      navigate(`/results/${attempt.id}`);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
      console.error('Détails de l\'erreur:', err.response?.data);
      setError(`Erreur lors de la soumission du quiz: ${err.response?.data?.error || err.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Chargement du quiz...</p>
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Ce quiz n'est pas disponible.</p>
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

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>Question {currentQuestion + 1} sur {quiz.questions.length}</p>
        </div>
      </div>

      <div className="quiz-container">
        <div className="timer" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center',
          color: timeLeft <= 5 ? '#e53e3e' : '#2d3748',
          marginBottom: '1.5rem'
        }}>
          ⏱️ {timeLeft}s
        </div>

        <div className="question-card">
          <h3 className="question-text">{question.question_text}</h3>
          
          <div className="options-container">
            {question.options && question.options.length > 0 ? (
              question.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${answers[question.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                  style={{ 
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    padding: '1.5rem',
                    margin: '0.75rem 0',
                    border: answers[question.id] === option ? '3px solid #4299e1' : '2px solid #e2e8f0',
                    background: answers[question.id] === option ? '#ebf8ff' : '#fff',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <span className="option-letter" style={{
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: answers[question.id] === option ? '#4299e1' : '#e2e8f0',
                    color: answers[question.id] === option ? 'white' : '#2d3748',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text" style={{ 
                    flex: 1, 
                    fontSize: '1.1rem',
                    fontWeight: answers[question.id] === option ? '600' : '400'
                  }}>
                    {option}
                  </span>
                  {answers[question.id] === option && (
                    <span style={{ fontSize: '1.5rem' }}>✓</span>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#e53e3e', padding: '2rem' }}>
                ⚠️ Aucune option disponible pour cette question
              </div>
            )}
          </div>
        </div>

        <div className="quiz-navigation" style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '2rem',
          gap: '1rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
            style={{ flex: 1 }}
          >
            ← Précédent
          </button>
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={isSubmitting}
              style={{ flex: 1 }}
            >
              Suivant →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !attempt}
              style={{ flex: 1, background: '#48bb78' }}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Terminer le quiz ✓'}
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#718096' }}>
          {answers[question.id] ? (
            <p style={{ fontSize: '1rem', fontWeight: '500' }}>
              ✓ Réponse sélectionnée: <strong>{answers[question.id]}</strong>
            </p>
          ) : (
            <p style={{ fontSize: '1rem' }}>Aucune réponse sélectionnée</p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.5rem', color: '#718096', fontSize: '0.9rem' }}>
          <p>
            {Object.keys(answers).length} / {quiz.questions.length} questions répondues
          </p>
        </div>

        {/* Debug info - À retirer en production */}
        {attempt && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            background: '#f0f0f0', 
            fontSize: '0.8rem',
            color: '#666',
            borderRadius: '4px'
          }}>
            Debug: Attempt ID = {attempt.id || 'undefined'}
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeQuiz;