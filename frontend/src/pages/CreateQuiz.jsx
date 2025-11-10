import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz, importQuizJSON, exportQuizJSON } from '../utils/api';

function CreateQuiz() {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    tags: '',
    difficulty: 'facile',
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const addQuestion = () => {
    if (questions.length >= 20) {
      setError('Un quiz ne peut pas avoir plus de 20 questions');
      return;
    }
    setQuestions([...questions, {
      question_type: 'QCM',
      question_text: '',
      options: ['', ''],
      correct_answer: ''
    }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'question_type') {
      newQuestions[index][field] = value;
      if (value === 'VRAI_FAUX') {
        newQuestions[index].options = ['Vrai', 'Faux'];
        newQuestions[index].correct_answer = '';
      } else if (value === 'QCM') {
        newQuestions[index].options = ['', ''];
        newQuestions[index].correct_answer = '';
      }
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (questions.length < 5) {
      setError('Un quiz doit avoir au moins 5 questions');
      return;
    }
    if (questions.length > 20) {
      setError('Un quiz ne peut pas avoir plus de 20 questions');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`La question ${i + 1} doit avoir un texte`);
        return;
      }
      if (!q.correct_answer) {
        setError(`La question ${i + 1} doit avoir une réponse correcte`);
        return;
      }
      if (q.question_type === 'QCM') {
        const emptyOptions = q.options.filter(opt => !opt.trim());
        if (emptyOptions.length > 0) {
          setError(`La question ${i + 1} a des options vides`);
          return;
        }
      }
    }

    try {
      const data = {
        ...quizData,
        questions: questions
      };
      await createQuiz(data);
      setSuccess('Quiz créé avec succès !');
      setTimeout(() => {
        navigate('/dashboard');  // Redirige vers la liste des quiz
      }, 1500);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la création du quiz');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setQuizData({
            title: imported.title || '',
            description: imported.description || '',
            tags: imported.tags || '',
            difficulty: imported.difficulty || 'facile',
          });
          setQuestions(imported.questions || []);
          setSuccess('Quiz importé avec succès !');
        } catch (err) {
          setError('Erreur lors de l\'import du fichier JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const data = {
      ...quizData,
      questions: questions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_${quizData.title || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h2>Créer un Quiz</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <label className="btn btn-secondary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
          📥 Importer JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <button className="btn btn-secondary" onClick={handleExport} style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
          📤 Exporter JSON
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre du Quiz *</label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
            required
            placeholder="Ex: Quiz de Mathématiques"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={quizData.description}
            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
            rows="3"
            placeholder="Décrivez brièvement le contenu du quiz..."
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={quizData.tags}
            onChange={(e) => setQuizData({ ...quizData, tags: e.target.value })}
            placeholder="Ex: mathématiques, histoire"
          />
        </div>

        <div className="form-group">
          <label>Difficulté *</label>
          <select
            value={quizData.difficulty}
            onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
          >
            <option value="facile">Facile (30s par question)</option>
            <option value="difficile">Difficile (15s par question)</option>
          </select>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Questions ({questions.length}/20)
        </h3>

        {questions.length === 0 && (
          <div style={{ 
            padding: '2rem', 
            background: '#f7fafc', 
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem',
            border: '2px dashed #cbd5e0'
          }}>
            <p style={{ color: '#718096' }}>Aucune question ajoutée. Cliquez sur le bouton ci-dessous pour commencer.</p>
          </div>
        )}

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-editor" style={{
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            background: '#fff'
          }}>
            <div className="question-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: 0 }}>Question {qIndex + 1}</h4>
              <button 
                type="button" 
                onClick={() => removeQuestion(qIndex)} 
                className="btn btn-danger" 
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
              >
                🗑️ Supprimer
              </button>
            </div>

            <div className="form-group">
              <label>Type de question *</label>
              <select
                value={question.question_type}
                onChange={(e) => updateQuestion(qIndex, 'question_type', e.target.value)}
              >
                <option value="QCM">QCM (Choix Multiples)</option>
                <option value="VRAI_FAUX">Vrai ou Faux</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question *</label>
              <textarea
                value={question.question_text}
                onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                required
                placeholder="Entrez votre question ici..."
                rows="2"
              />
            </div>

            {question.question_type === 'QCM' ? (
              <div className="form-group">
                <label>Options de réponse *</label>
                <div className="options-list">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-item" style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                        style={{ flex: 1 }}
                      />
                      {question.options.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => removeOption(qIndex, oIndex)}
                          style={{
                            background: '#f56565',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addOption(qIndex)} 
                    className="btn btn-secondary"
                    style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: '0.5rem' }}
                  >
                    ➕ Ajouter une option
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>Options</label>
                <div style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ margin: 0, color: '#4a5568' }}>
                    ✓ Vrai<br />
                    ✗ Faux
                  </p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Réponse correcte *</label>
              {question.question_type === 'QCM' ? (
                <select
                  value={question.correct_answer}
                  onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez la bonne réponse</option>
                  {question.options.map((option, i) => (
                    <option key={i} value={option}>{option || `Option ${i + 1}`}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={question.correct_answer}
                  onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                  required
                >
                  <option value="">Sélectionnez la bonne réponse</option>
                  <option value="Vrai">Vrai</option>
                  <option value="Faux">Faux</option>
                </select>
              )}
            </div>
          </div>
        ))}

        <button 
          type="button" 
          onClick={addQuestion} 
          className="btn btn-success" 
          style={{ marginBottom: '1rem', width: '100%' }}
          disabled={questions.length >= 20}
        >
          ➕ Ajouter une Question {questions.length >= 20 ? '(Maximum atteint)' : ''}
        </button>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={questions.length < 5}
        >
          {questions.length < 5 
            ? `Ajoutez ${5 - questions.length} question${5 - questions.length > 1 ? 's' : ''} minimum` 
            : '✓ Créer le Quiz'}
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
