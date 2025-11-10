# QuizMaster - Plateforme de Quiz en Ligne

QuizMaster est une plateforme complète de création et passation de quiz/examens en ligne, simple et intuitive pour les débutants.

## 🎯 Fonctionnalités

### Authentification
- ✅ Inscription et connexion utilisateur
- ✅ Gestion sécurisée des sessions avec JWT

### Création de Quiz
- ✅ Éditeur de questions (QCM et Vrai/Faux)
- ✅ Entre 5 et 20 questions par quiz
- ✅ Sélection de tags personnalisés
- ✅ Choix de difficulté :
  - Facile : 30 secondes par question
  - Difficile : 15 secondes par question
- ✅ Import/Export de questions au format JSON

### Passation d'Examens
- ✅ Interface responsive pour tous appareils
- ✅ Timer avec alertes visuelles
- ✅ Mode plein écran anti-triche
- ✅ Tentatives multiples possibles

### Correction et Évaluation
- ✅ Correction automatique instantanée
- ✅ Surlignage des réponses :
  - Vert : réponse correcte
  - Rouge : réponse incorrecte
- ✅ Affichage de la bonne réponse

### Analytics
- ✅ Tableau de bord avec statistiques
- ✅ Graphiques avec Chart.js
- ✅ Export des résultats en PDF

## 🛠️ Stack Technique

### Backend
- Python 3.11
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- ReportLab (génération PDF)

### Frontend
- React 18+
- Vite (build tool)
- Chart.js (visualisations)
- Axios (requêtes HTTP)
- React Router (navigation)

## 📦 Installation et Démarrage

### Prérequis
- Python 3.11+
- Node.js 20+

### Étapes d'installation

1. **Installer les dépendances backend**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

2. **Installer les dépendances frontend**
```bash
cd frontend
npm install
```

3. **Démarrer les serveurs**

Terminal 1 - Backend :
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

Terminal 2 - Frontend :
```bash
cd frontend
npm run dev
```

4. **Accéder à l'application**
- Frontend : http://localhost:5000
- Backend API : http://localhost:8000/api

## 📖 Guide d'utilisation

### 1. Créer un compte
1. Cliquez sur "Pas encore de compte ? Inscrivez-vous"
2. Remplissez le formulaire d'inscription
3. Connectez-vous avec vos identifiants

### 2. Créer un quiz
1. Sur le tableau de bord, cliquez sur "Créer un Quiz"
2. Remplissez les informations du quiz :
   - Titre
   - Description
   - Tags
   - Difficulté (Facile ou Difficile)
3. Ajoutez entre 5 et 20 questions
4. Pour chaque question :
   - Choisissez le type (QCM ou Vrai/Faux)
   - Écrivez la question
   - Ajoutez les options de réponse
   - Sélectionnez la bonne réponse
5. Cliquez sur "Créer le Quiz"

### 3. Passer un quiz
1. Sur le tableau de bord, cliquez sur un quiz
2. Cliquez sur "Mode Plein Écran Anti-Triche" (recommandé)
3. Répondez aux questions dans le temps imparti
4. Naviguez entre les questions avec Précédent/Suivant
5. Cliquez sur "Terminer" pour soumettre vos réponses

### 4. Voir les résultats
1. Après avoir terminé un quiz, vous verrez :
   - Votre score en pourcentage
   - Le nombre de bonnes réponses
   - Le détail de chaque question avec :
     - Votre réponse (surlignée en vert si correcte, rouge si incorrecte)
     - La bonne réponse si vous vous êtes trompé
2. Téléchargez vos résultats en PDF

### 5. Consulter vos statistiques
1. Cliquez sur "Mes Statistiques"
2. Visualisez :
   - Nombre total de tentatives
   - Score moyen global
   - Graphique des performances par quiz
   - Détails par quiz (tentatives, meilleur score, moyenne)

### 6. Import/Export de quiz
- **Export** : Dans l'éditeur de quiz, cliquez sur "Exporter JSON"
- **Import** : Cliquez sur "Importer JSON" et sélectionnez un fichier

## 📁 Structure du Projet

```
QuizMaster/
├── backend/                 # Django backend
│   ├── api/                # Application API
│   │   ├── models.py       # Modèles (Quiz, Question, Attempt)
│   │   ├── serializers.py  # Serializers REST
│   │   ├── views.py        # Vues API
│   │   └── urls.py         # Routes API
│   ├── quizmaster/         # Configuration Django
│   │   └── settings.py     # Paramètres Django
│   ├── data/               # Stockage JSON
│   └── requirements.txt    # Dépendances Python
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Composants réutilisables
    │   │   └── Navbar.jsx
    │   ├── pages/          # Pages de l'application
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateQuiz.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   ├── Results.jsx
    │   │   └── Stats.jsx
    │   ├── utils/          # Utilitaires
    │   │   └── api.js      # Fonctions API
    │   ├── styles/         # Styles CSS
    │   │   └── App.css
    │   ├── App.jsx         # Composant principal
    │   └── main.jsx        # Point d'entrée
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔑 API Endpoints

### Authentification
- `POST /api/register/` - Inscription
- `POST /api/login/` - Connexion

### Quiz
- `GET /api/quizzes/` - Liste des quiz
- `GET /api/quizzes/:id/` - Détails d'un quiz
- `POST /api/quizzes/` - Créer un quiz
- `GET /api/quizzes/:id/export_json/` - Exporter en JSON
- `POST /api/quizzes/import_json/` - Importer depuis JSON

### Tentatives
- `POST /api/attempts/` - Démarrer une tentative
- `POST /api/attempts/:id/submit/` - Soumettre les réponses
- `GET /api/attempts/:id/export_pdf/` - Exporter en PDF

### Statistiques
- `GET /api/stats/` - Statistiques utilisateur

## 🎨 Personnalisation

Le code est simple et bien commenté pour faciliter les modifications :

- **Couleurs** : Modifiez `frontend/src/styles/App.css`
- **Temps des questions** : Changez dans `backend/api/models.py` (méthode `get_time_per_question`)
- **Nombre de questions** : Ajustez dans `backend/api/serializers.py` (validation)

## 📝 Notes pour débutants

- Le backend Django gère toutes les données et la logique métier
- Le frontend React affiche l'interface utilisateur
- Les deux communiquent via des API REST
- L'authentification utilise des tokens JWT stockés dans le navigateur
- Les quiz sont sauvegardés dans une base de données SQLite (simple et légère)

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez que les deux serveurs (backend et frontend) sont démarrés
2. Consultez les logs dans le terminal
3. Assurez-vous que les ports 5000 et 8000 sont disponibles

## 📜 Licence

Ce projet est conçu à des fins éducatives et peut être librement modifié et redistribué.
