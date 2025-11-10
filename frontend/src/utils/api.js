import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // CORRECTION ICI : Utiliser "Token" au lieu de "Bearer" pour Django Token Authentication
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTIFICATION ====================
export const register = (userData) => api.post('/register/', userData);
export const login = (credentials) => api.post('/login/', credentials);

// ==================== QUIZ (pour les enseignants) ====================
// Récupère uniquement les quiz créés par l'utilisateur connecté
export const getQuizzes = () => api.get('/quizzes/');

// Récupère un quiz spécifique de l'utilisateur connecté
export const getQuiz = (id) => api.get(`/quizzes/${id}/`);

// Récupère un quiz public (pour les étudiants via lien partagé) - SANS AUTH
export const getPublicQuiz = (id) => {
  console.log('API: Chargement du quiz public', id);
  return axios.get(`${API_URL}/quizzes/${id}/public/`);
};

// Crée un nouveau quiz
export const createQuiz = (quizData) => api.post('/quizzes/', quizData);

// Exporte un quiz au format JSON
export const exportQuizJSON = (id) => api.get(`/quizzes/${id}/export_json/`);

// Importe un quiz depuis un fichier JSON
export const importQuizJSON = (quizData) => api.post('/quizzes/import_json/', quizData);

// ==================== TENTATIVES (ATTEMPTS) ====================
// Crée une nouvelle tentative pour un quiz - SANS AUTH pour les étudiants
export const createAttempt = (quizId) => {
  console.log('API: Création de tentative pour quiz', quizId);
  return axios.post(`${API_URL}/attempts/`, { quiz: quizId });
};

// Soumet les réponses d'une tentative - SANS AUTH
export const submitAttempt = (attemptId, answers) => {
  console.log('API: Soumission de la tentative', attemptId);
  console.log('API: Réponses:', answers);
  return axios.post(`${API_URL}/attempts/${attemptId}/submit/`, { answers });
};

// Récupère toutes les tentatives de l'utilisateur connecté
export const getAttempts = () => api.get('/attempts/');

// Récupère une tentative spécifique - SANS AUTH pour voir les résultats
export const getAttempt = (attemptId) => {
  console.log('API: Récupération de la tentative', attemptId);
  return axios.get(`${API_URL}/attempts/${attemptId}/`);
};

// Exporte les résultats d'une tentative en PDF - SANS AUTH
export const exportAttemptPDF = (attemptId) => 
  axios.get(`${API_URL}/attempts/${attemptId}/export_pdf/`, { responseType: 'blob' });

// ==================== STATISTIQUES ====================
// Récupère les statistiques de l'utilisateur connecté
export const getUserStats = () => api.get('/stats/');

export default api;