import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../utils/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getUserStats();
      setStats(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  if (!stats || stats.total_attempts === 0) {
    return (
      <div className="container">
        <h2>Mes Statistiques</h2>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p>Vous n'avez pas encore passé de quiz.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem', width: 'auto', padding: '0.8rem 1.5rem' }}>
            Commencer un quiz
          </button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: stats.quiz_stats.map(q => q.quiz_title),
    datasets: [
      {
        label: 'Meilleur Score (%)',
        data: stats.quiz_stats.map(q => q.best_score),
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
      },
      {
        label: 'Score Moyen (%)',
        data: stats.quiz_stats.map(q => q.avg_score),
        backgroundColor: 'rgba(118, 75, 162, 0.7)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performances par Quiz'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Mes Statistiques</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>
          Retour
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tentatives</h3>
          <p>{stats.total_attempts}</p>
        </div>
        <div className="stat-card">
          <h3>Score Moyen</h3>
          <p>{stats.average_score.toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <h3>Quiz Complétés</h3>
          <p>{stats.quiz_stats.length}</p>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Détails par Quiz</h3>
        {stats.quiz_stats.map((quizStat, index) => (
          <div key={index} className="quiz-card" style={{ marginBottom: '1rem' }}>
            <h3>{quizStat.quiz_title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <div>
                <strong>Tentatives :</strong> {quizStat.attempts}
              </div>
              <div>
                <strong>Meilleur score :</strong> {quizStat.best_score.toFixed(1)}%
              </div>
              <div>
                <strong>Moyenne :</strong> {quizStat.avg_score.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
