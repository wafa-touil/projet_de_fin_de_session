Definition of Done (DoD) - Projet QuizMaster
Ce document définit les critères stricts qui doivent être remplis pour qu'une fonctionnalité, une correction de bug ou une tâche soit considérée comme "Terminée" (Done).

1. Qualité du Code
 Standards de code : Le code respecte les conventions de style du projet (PEP 8 pour Python, ESLint/Prettier pour React).
 Propreté : Pas de code mort, de commentaires inutiles ou de console.log / print de débogage oubliés.
 Revue de code : Le code a été relu et approuvé par au moins un autre développeur (Pull Request validée).
 Refactoring : Le code ajouté ne détériore pas la dette technique existante.
2. Tests & Validation
 Tests Unitaires : Les fonctions critiques (modèles, utilitaires) sont couvertes par des tests unitaires (ex: QuizModelUnitTest).
 Tests d'Intégration : Les flux principaux (ex: Inscription -> Création de Quiz) sont validés par des tests d'intégration (ex: QuizIntegrationTest).
 
3. Fonctionnalité & Métier
 Critères d'Acceptation : La fonctionnalité répond à 100% des exigences spécifiées dans la User Story ou le ticket.
 Cas Limites : Les cas d'erreur sont gérés proprement (ex: formulaire vide, email invalide, perte de connexion).
 Sécurité :
Pas de données sensibles exposées (mots de passe, clés API).
Les permissions sont vérifiées (ex: un étudiant ne peut pas créer de quiz).
4. Expérience Utilisateur (Frontend)
 Design : L'interface correspond aux maquettes ou au guide de style (couleurs, typographie).
 Responsivité : L'affichage est correct sur Desktop, Tablette et Mobile.
 Feedback : L'utilisateur reçoit un retour visuel pour ses actions (messages de succès, loaders, erreurs).
 Accessibilité : Les éléments interactifs sont accessibles au clavier et ont des labels clairs.
5. Documentation
 Code : Les fonctions complexes sont commentées pour expliquer le pourquoi (pas le comment).
 API : Si l'API a changé, la documentation (Swagger/OpenAPI) est à jour.
 Utilisateur : Si nécessaire, le guide utilisateur ou la FAQ a été mis à jour.
6. Déploiement
 Build : Le projet se compile sans erreur ni avertissement critique.
 Environnement : Les variables d'environnement nécessaires sont documentées ou configurées.
 
Une tâche n'est pas finie tant que TOUTES les cases applicables ne sont pas cochées.