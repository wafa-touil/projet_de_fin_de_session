# QuizMaster - Démarrage Rapide

## 🚀 Démarrer en 3 étapes

### 1. Installer les dépendances

**Backend** :
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

**Frontend** :
```bash
cd frontend
npm install
```

### 2. Démarrer les serveurs

Ouvrez **2 terminaux** :

**Terminal 1 - Backend** :
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```

### 3. Ouvrir l'application

Allez sur : **http://localhost:5000**

## 🎮 Compte de démonstration

Pour tester rapidement :
- **Nom d'utilisateur** : `demo`
- **Mot de passe** : `demo123`

Ce compte contient déjà un quiz de mathématiques avec 5 questions !

## 📝 Créer votre propre compte

1. Cliquez sur "Pas encore de compte ? Inscrivez-vous"
2. Remplissez le formulaire
3. Connectez-vous

## ✨ Premiers pas

### Créer un quiz

1. Cliquez sur "**Créer un Quiz**"
2. Donnez un titre et une description
3. Choisissez la difficulté :
   - **Facile** = 30 secondes par question
   - **Difficile** = 15 secondes par question
4. Ajoutez au moins **5 questions** (maximum 20)
5. Pour chaque question :
   - Choisissez le type (QCM ou Vrai/Faux)
   - Écrivez la question
   - Ajoutez les options
   - Sélectionnez la bonne réponse
6. Cliquez sur "**Créer le Quiz**"

### Passer un quiz

1. Sur le tableau de bord, cliquez sur un quiz
2. Cliquez sur "**Mode Plein Écran**" (recommandé)
3. Répondez aux questions
4. Le timer vous alerte quand il reste peu de temps (rouge)
5. Cliquez sur "**Terminer**" pour voir vos résultats

### Voir vos résultats

Après avoir terminé un quiz :
- Votre score s'affiche en grand
- Vos réponses sont surlignées :
  - ✅ **Vert** = Correct
  - ❌ **Rouge** = Incorrect (la bonne réponse est montrée)
- Téléchargez un PDF de vos résultats

### Consulter vos statistiques

1. Cliquez sur "**Mes Statistiques**"
2. Voyez :
   - Nombre total de tentatives
   - Score moyen
   - Graphiques de performance
   - Détails par quiz

## 📦 Import/Export

### Exporter un quiz en JSON

1. Allez dans "Créer un Quiz"
2. Créez ou modifiez un quiz
3. Cliquez sur "**Exporter JSON**"
4. Le fichier se télécharge automatiquement

### Importer un quiz depuis JSON

1. Cliquez sur "**Importer JSON**"
2. Sélectionnez votre fichier `.json`
3. Le quiz est chargé automatiquement
4. Cliquez sur "**Créer le Quiz**" pour le sauvegarder

## 🎯 Fonctionnalités clés

### Timer automatique
- Compte à rebours pour chaque question
- Alerte visuelle quand il reste 5 secondes
- Passe automatiquement à la question suivante si le temps expire

### Mode anti-triche
- Active le mode plein écran
- Empêche de quitter facilement le quiz
- Parfait pour les examens officiels

### Tentatives multiples
- Vous pouvez repasser un quiz autant de fois que vous voulez
- Toutes vos tentatives sont enregistrées
- Suivez votre progression au fil du temps

### Correction automatique
- Les réponses sont corrigées instantanément
- Vous voyez immédiatement vos erreurs
- Les bonnes réponses sont toujours affichées

## ⚙️ Configuration

### Changer le port du frontend

Éditez `frontend/vite.config.js` :
```javascript
server: {
    port: 3000,  // Changez ici
}
```

### Changer le port du backend

```bash
python manage.py runserver 0.0.0.0:9000
```

Puis mettez à jour le proxy dans `frontend/vite.config.js`.

## 🐛 Problèmes courants

### "Module not found"
**Solution** : Réinstallez les dépendances
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### "Port already in use"
**Solution** : Changez le port ou arrêtez le processus qui l'utilise
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Ou changez le port dans vite.config.js
```

### "Database error"
**Solution** : Créez la base de données
```bash
cd backend
python manage.py migrate
```

### La page ne se charge pas
**Vérifications** :
1. Les 2 serveurs sont-ils démarrés ?
2. Y a-t-il des erreurs dans les terminaux ?
3. Le bon port est-il utilisé (5000) ?

## 📚 Ressources

- **README.md** - Documentation complète
- **ARCHITECTURE.md** - Comment le projet fonctionne
- **EXPORT_GUIDE.md** - Comment exporter le projet

## 🆘 Besoin d'aide ?

1. Vérifiez les logs dans les terminaux
2. Consultez ARCHITECTURE.md pour comprendre le fonctionnement
3. Tous les fichiers sont commentés pour faciliter la compréhension

## 🎉 Bon quiz !

Vous êtes prêt à créer et passer vos premiers quiz avec QuizMaster !

**Astuce** : Commencez par vous connecter avec le compte `demo` pour voir comment tout fonctionne avant de créer votre propre contenu.
