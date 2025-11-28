

# Create your tests here.
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Quiz, Question, Attempt

# Récupération du modèle utilisateur personnalisé
User = get_user_model()

class QuizModelUnitTest(TestCase):
    """
    TEST UNITAIRE : Vérifie la logique des modèles isolément.
    """
    def setUp(self):
        self.teacher = User.objects.create_user(
            username='teacher_unit',
            password='password123',
            role='teacher'
        )

    def test_create_quiz_model(self):
        """Test basique : on peut créer un quiz relié à un enseignant"""
        quiz = Quiz.objects.create(
            title="Quiz Test Unitaire",
            description="Description du test",
            creator=self.teacher,
            difficulty="facile"
        )
        
        # Vérifications (Assertions)
        self.assertEqual(quiz.title, "Quiz Test Unitaire")
        self.assertEqual(quiz.creator, self.teacher)
        self.assertEqual(str(quiz), "Quiz Test Unitaire")
        self.assertIsNotNone(quiz.created_at)

class QuizIntegrationTest(APITestCase):
    """
    TEST D'INTÉGRATION : Vérifie le flux complet via l'API (Inscription -> Création).
    """
    def setUp(self):
        # Définissez ici vos URLs. 
        # Si vous utilisez router.register('quizzes', ...), l'URL est souvent '/api/quizzes/' ou juste '/quizzes/'
        self.register_url = '/register/' 
        self.quizzes_url = '/quizzes/'
        
    def test_full_teacher_flow(self):
        """
        Scénario : Un nouvel enseignant s'inscrit et crée un quiz valide.
        """
        # 1. INSCRIPTION (Register)
        teacher_data = {
            'username': 'integration_prof',
            'password': 'securepassword123',
            'email': 'prof@test.com',
            'role': 'teacher'
        }
        response = self.client.post(self.register_url, teacher_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "L'inscription devrait réussir (201)")

        # 2. AUTHENTIFICATION (Simulation)
        # Dans un vrai test, on pourrait récupérer le token, mais force_authenticate est plus simple pour tester l'API
        user = User.objects.get(username='integration_prof')
        self.client.force_authenticate(user=user)

        # 3. CRÉATION DE QUIZ
        # Note: Votre serializer (QuizCreateSerializer) exige au moins 5 questions
        questions_data = [
            {
                'question_text': f'Question {i}',
                'question_type': 'QCM',
                'options': ['A', 'B', 'C'],
                'correct_answer': 'A',
                'order': i
            } for i in range(5)
        ]

        quiz_data = {
            'title': 'Quiz Intégration',
            'description': 'Créé via le test automatique',
            'difficulty': 'moyen',
            'tags': 'test',
            'questions': questions_data
        }

        response = self.client.post(self.quizzes_url, quiz_data, format='json')

        # 4. VÉRIFICATIONS FINALES
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, f"La création du quiz a échoué : {response.data}")
        self.assertEqual(Quiz.objects.count(), 1)
        self.assertEqual(Question.objects.count(), 5)
        
        created_quiz = Quiz.objects.get()
        self.assertEqual(created_quiz.creator, user, "Le quiz doit appartenir à l'utilisateur connecté")

    def test_student_cannot_create_quiz(self):
        """
        Scénario négatif : Un étudiant ne doit PAS pouvoir créer de quiz.
        """
        # Création d'un étudiant
        student = User.objects.create_user(username='student_test', password='pwd', role='student')
        self.client.force_authenticate(user=student)

        quiz_data = {'title': 'Hacker Quiz', 'questions': []} # Données minimales
        response = self.client.post(self.quizzes_url, quiz_data)

        # Doit être interdit (403 Forbidden)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
