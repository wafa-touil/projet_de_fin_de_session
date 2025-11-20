import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from ..models import Quiz, Question, Attempt

User = get_user_model()

@pytest.mark.django_db
def test_submit_quiz_attempt():
    client = APIClient()

    # Création d'un professeur et d'un quiz
    teacher = User.objects.create_user(username='teacher1', password='pass', role='teacher')
    quiz = Quiz.objects.create(title="Quiz Test", creator=teacher)
    q1 = Question.objects.create(quiz=quiz, question_text="Q1", correct_answer="Answer1", order=1)
    q2 = Question.objects.create(quiz=quiz, question_text="Q2", correct_answer="Answer2", order=2)

    # Création d'un étudiant
    student = User.objects.create_user(username='student1', password='pass', role='student')

    # Création d'une tentative de ce quiz par cet étudiant
    attempt = Attempt.objects.create(quiz=quiz, user=student)

    # Réponses envoyées par l’étudiant
    answers = {
        str(q1.id): "Answer1",
        str(q2.id): "WrongAnswer"
    }

    # URL de l'endpoint pour soumettre la tentative
    url = reverse('attempt-submit', args=[attempt.id])

    # Soumission via API POST
    response = client.post(url, {'answers': answers}, format='json')

    # Assertions pour vérifier que la soumission est correcte
    assert response.status_code == 200
    assert response.data['score'] == 50  # 1 bonne réponse sur 2 = 50 %
    assert response.data['correct_count'] == 1
    assert response.data['total_questions'] == 2
