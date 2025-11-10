# Architecture QuizMaster - Guide pour Débutants

Ce document explique comment le projet QuizMaster est organisé de manière simple.

## Vue d'ensemble

QuizMaster suit une architecture **Client-Serveur** :

```
┌─────────────┐                    ┌─────────────┐
│   Frontend  │  ←──── HTTP ────→  │   Backend   │
│   (React)   │      (API REST)    │   (Django)  │
│  Port 5000  │                    │  Port 8000  │
└─────────────┘                    └─────────────┘
     │                                    │
     │                                    │
  Navigateur                         Base de données
                                        (SQLite)
```

## Backend Django

### Structure des données (Modèles)

Le backend utilise 3 modèles principaux :

#### 1. Quiz
Représente un quiz complet.
```python
- title: Titre du quiz
- description: Description
- creator: Créateur (utilisateur)
- tags: Mots-clés
- difficulty: Difficulté (facile/difficile)
- created_at: Date de création
```

#### 2. Question
Représente une question dans un quiz.
```python
- quiz: Quiz parent
- question_type: Type (QCM ou VRAI_FAUX)
- question_text: Texte de la question
- options: Liste des options (JSON)
- correct_answer: Bonne réponse
- order: Ordre de la question
```

#### 3. Attempt
Représente une tentative de quiz par un utilisateur.
```python
- quiz: Quiz tenté
- user: Utilisateur
- started_at: Date de début
- completed_at: Date de fin
- score: Score obtenu (%)
- answers: Réponses et résultats (JSON)
```

**Note importante** : Le modèle `Attempt` stocke les résultats dans le champ `answers` (format JSON) au lieu d'avoir un modèle `Result` séparé. C'est une approche simplifiée adaptée aux débutants :

```json
{
  "question_id_1": {
    "user_answer": "Réponse de l'utilisateur",
    "correct_answer": "Bonne réponse",
    "is_correct": true/false
  },
  ...
}
```

### API Endpoints

Le backend expose ces endpoints :

#### Authentification
- `POST /api/register/` - Créer un compte
- `POST /api/login/` - Se connecter (retourne un token JWT)

#### Quiz
- `GET /api/quizzes/` - Liste tous les quiz
- `GET /api/quizzes/:id/` - Détails d'un quiz
- `POST /api/quizzes/` - Créer un quiz
- `GET /api/quizzes/:id/export_json/` - Exporter en JSON
- `POST /api/quizzes/import_json/` - Importer depuis JSON

#### Tentatives
- `POST /api/attempts/` - Commencer une tentative
- `POST /api/attempts/:id/submit/` - Soumettre les réponses
- `GET /api/attempts/:id/export_pdf/` - Exporter en PDF

#### Statistiques
- `GET /api/stats/` - Statistiques de l'utilisateur

### Authentification JWT

L'authentification utilise des **JSON Web Tokens** :

1. L'utilisateur se connecte
2. Le serveur retourne un token
3. Le frontend stocke ce token dans `localStorage`
4. Chaque requête inclut le token dans l'en-tête `Authorization`

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Frontend React

### Structure des pages

```
src/
├── components/
│   └── Navbar.jsx          # Barre de navigation
│
├── pages/
│   ├── Login.jsx           # Page de connexion
│   ├── Register.jsx        # Page d'inscription
│   ├── Dashboard.jsx       # Liste des quiz
│   ├── CreateQuiz.jsx      # Créer/éditer un quiz
│   ├── TakeQuiz.jsx        # Passer un quiz
│   ├── Results.jsx         # Voir les résultats
│   └── Stats.jsx           # Statistiques
│
├── utils/
│   └── api.js              # Fonctions pour appeler l'API
│
└── styles/
    └── App.css             # Styles CSS
```

### Flux de données

#### 1. Création d'un quiz
```
CreateQuiz.jsx
    ↓ (formulaire)
api.createQuiz()
    ↓ (POST /api/quizzes/)
Backend (Django)
    ↓ (sauvegarde)
Base de données
```

#### 2. Passation d'un quiz
```
TakeQuiz.jsx
    ↓ (chargement)
api.getQuiz() + api.createAttempt()
    ↓ (GET /api/quizzes/:id/ + POST /api/attempts/)
Backend retourne quiz + crée tentative
    ↓ (utilisateur répond)
api.submitAttempt()
    ↓ (POST /api/attempts/:id/submit/)
Backend calcule le score
    ↓ (redirection)
Results.jsx affiche les résultats
```

#### 3. Affichage des statistiques
```
Stats.jsx
    ↓ (chargement)
api.getUserStats()
    ↓ (GET /api/stats/)
Backend calcule les stats
    ↓ (affichage)
Chart.js affiche les graphiques
```

### État et Navigation

Le frontend utilise :
- **React Router** pour la navigation entre les pages
- **localStorage** pour stocker le token JWT et le nom d'utilisateur
- **React State** pour gérer l'état local des composants
- **Axios** pour les appels API

## Fonctionnalités clés

### Timer avec alertes

Dans `TakeQuiz.jsx` :
```javascript
// Le timer démarre à chaque question
useEffect(() => {
  setTimeLeft(quiz.time_per_question); // 30s ou 15s
}, [currentQuestion]);

// Décompte chaque seconde
useEffect(() => {
  if (timeLeft > 0) {
    setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  } else {
    handleNext(); // Passe à la question suivante
  }
}, [timeLeft]);
```

### Mode plein écran

```javascript
const enterFullscreen = () => {
  document.documentElement.requestFullscreen();
  setIsFullscreen(true);
};
```

### Correction automatique

Le backend compare les réponses dans `views.py` :
```python
for question in questions:
    user_answer = answers.get(str(question.id))
    is_correct = user_answer == question.correct_answer
    
    if is_correct:
        correct_count += 1
```

### Surlignage coloré

Dans `Results.jsx` :
```javascript
// Bordure verte si correct, rouge sinon
border: `2px solid ${isCorrect ? '#48bb78' : '#f56565'}`

// Fond vert pour bonnes réponses
background: isCorrect ? '#c6f6d5' : '#fed7d7'
```

## Sécurité

### CORS (Cross-Origin Resource Sharing)
Le backend autorise les requêtes du frontend :
```python
CORS_ALLOW_ALL_ORIGINS = True
```

### Protection CSRF
Django protège contre les attaques CSRF automatiquement.

### Validation des données
- Le backend vérifie que les quiz ont 5-20 questions
- Les mots de passe sont hashés automatiquement par Django
- Les tokens JWT expirent après 5 heures

## Base de données

QuizMaster utilise **SQLite** par défaut :
- Simple : un seul fichier `db.sqlite3`
- Pas de serveur de base de données nécessaire
- Parfait pour débuter

Tables créées :
- `auth_user` - Utilisateurs
- `api_quiz` - Quiz
- `api_question` - Questions
- `api_attempt` - Tentatives

## Configuration

### Backend (settings.py)
```python
INSTALLED_APPS = [
    'api',              # Notre application
    'rest_framework',   # API REST
    'corsheaders',      # CORS
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### Frontend (vite.config.js)
```javascript
server: {
    host: '0.0.0.0',
    port: 5000,
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
        }
    }
}
```

Le proxy redirige `/api/*` vers le backend Django.

## Déploiement futur

Pour déployer en production, vous devrez :
1. Changer `DEBUG = False` dans Django
2. Configurer une vraie base de données (PostgreSQL)
3. Ajouter un serveur web (Nginx + Gunicorn)
4. Utiliser HTTPS
5. Configurer les variables d'environnement

Mais pour apprendre et tester, la configuration actuelle est parfaite !

## Résumé

QuizMaster est un projet **full-stack** simple :
- **Backend** : Django gère les données et la logique
- **Frontend** : React affiche l'interface
- **Communication** : API REST avec authentification JWT
- **Données** : Stockées dans SQLite (simple et efficace)

Tout le code est organisé de manière claire pour faciliter la compréhension et les modifications futures.
