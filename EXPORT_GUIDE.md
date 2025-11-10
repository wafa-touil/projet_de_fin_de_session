# Guide d'Export QuizMaster

Ce guide explique comment exporter le projet QuizMaster pour l'utiliser ailleurs.

## Méthode 1 : Export ZIP automatique (Recommandé)

1. Exécutez le script d'export :
```bash
python create_export.py
```

2. Un fichier `QuizMaster_Export.zip` sera créé
3. Téléchargez ce fichier
4. Décompressez-le où vous voulez

## Méthode 2 : Export manuel

### Fichiers à copier :

```
QuizMaster/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── quizmaster/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateQuiz.jsx
│   │   │   ├── TakeQuiz.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Stats.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md
├── EXPORT_GUIDE.md
└── create_export.py
```

### Fichiers à NE PAS copier :
- `__pycache__/` (Python cache)
- `node_modules/` (dépendances Node.js - trop volumineux)
- `db.sqlite3` (base de données locale)
- `.git/` (historique Git)
- `venv/` ou `env/` (environnement virtuel Python)

## Utilisation après export

1. **Installer les dépendances**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   
   # Frontend
   cd frontend
   npm install
   ```

2. **Démarrer l'application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python manage.py runserver
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Accéder à l'application**
   - Ouvrez votre navigateur à : http://localhost:5000

## Structure minimale requise

Pour que le projet fonctionne, vous devez avoir :

### Backend (Django)
- Python 3.11+
- Tous les fichiers dans `backend/api/`
- Tous les fichiers dans `backend/quizmaster/`
- `manage.py`
- `requirements.txt`

### Frontend (React)
- Node.js 20+
- Tous les fichiers dans `frontend/src/`
- `index.html`
- `vite.config.js`
- `package.json`

## Taille approximative

- Avec `node_modules/` : ~200-300 MB
- Sans `node_modules/` : ~5-10 MB

**Recommandation** : Exportez SANS `node_modules/` et réinstallez avec `npm install` après l'export.

## Problèmes courants

### "Module not found"
- Réinstallez les dépendances : `npm install` (frontend) ou `pip install -r requirements.txt` (backend)

### "Port already in use"
- Changez les ports dans `vite.config.js` (frontend) ou utilisez `python manage.py runserver 0.0.0.0:8001` (backend)

### "Database error"
- Exécutez `python manage.py migrate` dans le dossier backend

## Support

Tous les fichiers source sont inclus et peuvent être modifiés selon vos besoins. Le code est simple et bien commenté pour faciliter la compréhension et les modifications.
