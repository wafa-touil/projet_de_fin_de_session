# QuizMaster - Plateforme de Quiz en Ligne

## Vue d'ensemble
QuizMaster est une plateforme complète de création et passation de quiz/examens en ligne, destinée aux établissements d'enseignement et organisations. L'application utilise Django (Python) pour le backend et React pour le frontend.

## Architecture du Projet
```
QuizMaster/
├── backend/          # Django backend
│   ├── quizmaster/   # Projet Django principal
│   ├── api/          # Application API REST
│   ├── data/         # Stockage JSON
│   └── requirements.txt
└── frontend/         # React frontend
    ├── src/
    └── package.json
```

## Fonctionnalités Principales

### Authentification
- Inscription et connexion utilisateur
- Gestion de sessions avec JWT

### Création de Quiz
- Éditeur de questions (QCM et Vrai/Faux)
- 5 à 20 questions par quiz
- Sélection de tags et difficulté
- Temps par question: 30s (facile), 15s (difficile)
- Import/export JSON

### Passation d'Examens
- Interface responsive
- Timer avec alertes visuelles
- Mode plein écran anti-triche
- Tentatives multiples

### Correction et Évaluation
- Correction automatique
- Surlignage vert (bonnes réponses) / rouge (erreurs)
- Affichage de la bonne réponse

### Analytics
- Tableau de bord avec Chart.js
- Export PDF des résultats

## Stack Technique

### Backend
- Django + Django REST Framework
- Authentification JWT
- Stockage JSON
- ReportLab pour PDF

### Frontend
- React 18+
- Chart.js
- Axios
- Tailwind CSS

## Changements Récents
- 2025-11-09: Projet complet terminé
  - Backend Django avec API REST complète
  - Frontend React avec toutes les pages
  - Système d'authentification JWT
  - Création et édition de quiz (5-20 questions)
  - Passation de quiz avec timer et mode plein écran
  - Correction automatique avec surlignage
  - Analytics avec Chart.js
  - Import/Export JSON et PDF
  - Interface responsive et moderne

## Préférences Utilisateur
- Code simple adapté aux débutants
- Documentation en français
- Organisation claire pour export facile
