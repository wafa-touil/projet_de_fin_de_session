from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
import logging

from .models import Quiz, Question, Attempt
from .serializers import (
    UserSerializer, QuizSerializer, QuizCreateSerializer,
    QuestionSerializer, AttemptSerializer, AttemptCreateSerializer,
    AttemptSubmitSerializer
)


logger = logging.getLogger('api')
User = get_user_model()


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'access': token.key,
            'username': user.username,
            'role': user.role,
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        data = serializer.data
        data.pop('password', None)
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_permissions(self):
        """
        Permissions personnalisées selon l'action
        """
        if self.action in ['list', 'retrieve', 'public']:
            # Lecture publique autorisée
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Création/modification nécessite authentification
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action == 'public':
            return Quiz.objects.all()
        if self.action in ['list', 'retrieve']:
            # Permettre la lecture de tous les quiz
            return Quiz.objects.all()
        if self.request.user.is_authenticated:
            # Pour les modifications, filtrer par créateur
            return Quiz.objects.filter(creator=self.request.user)
        return Quiz.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return QuizCreateSerializer
        return QuizSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Vous devez être connecté pour créer un quiz.")
        if not self.request.user.is_teacher():
            raise PermissionDenied("Seuls les enseignants peuvent créer des quiz.")
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def public(self, request, pk=None):
        try:
            quiz = Quiz.objects.get(pk=pk)
            serializer = self.get_serializer(quiz)
            return Response(serializer.data)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz non trouvé'}, status=status.HTTP_404_NOT_FOUND)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Question.objects.all()
        quiz_id = self.request.query_params.get('quiz', None)
        if quiz_id is not None:
            queryset = queryset.filter(quiz_id=quiz_id)
        return queryset


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer

    def get_permissions(self):
        if self.action in ['create', 'retrieve', 'submit']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Pour les actions authentifiées, filtrer par utilisateur
        if self.request.user.is_authenticated and self.action not in ['create', 'retrieve', 'submit']:
            return Attempt.objects.filter(user=self.request.user)
        # Pour les actions publiques, retourner tous les objets
        return Attempt.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return AttemptCreateSerializer
        return AttemptSerializer

    def retrieve(self, request, *args, **kwargs):
        """Permet de récupérer une tentative sans authentification"""
        try:
            attempt = Attempt.objects.get(pk=kwargs.get('pk'))
            serializer = self.get_serializer(attempt)
            return Response(serializer.data)
        except Attempt.DoesNotExist:
            return Response({'error': 'Tentative non trouvée'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        logger.info(f"=== CRÉATION D'UNE TENTATIVE ===")
        logger.debug(f"Request data: {request.data}")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.user.is_authenticated:
            logger.info(f"Utilisateur authentifié: {request.user.username}")
            attempt = serializer.save(user=request.user)
        else:
            logger.info("Création d'une tentative anonyme")
            attempt = serializer.save(user=None)

        logger.info(f"✅ Tentative créée - ID: {attempt.id}")

        response_serializer = AttemptSerializer(attempt)
        logger.debug(f"Réponse envoyée: {response_serializer.data}")

        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request, pk=None):
        logger.info(f"=== SOUMISSION DE LA TENTATIVE {pk} ===")
        logger.debug(f"Données reçues: {request.data}")

        # Récupérer la tentative directement sans filtrer par utilisateur
        try:
            attempt = Attempt.objects.get(pk=pk)
        except Attempt.DoesNotExist:
            logger.error(f"Tentative {pk} introuvable")
            return Response({'error': 'Tentative non trouvée'}, status=status.HTTP_404_NOT_FOUND)

        if attempt.completed_at:
            logger.warning(f"Tentative {pk} déjà soumise")
            return Response({'error': 'Cette tentative a déjà été soumise.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AttemptSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Erreur de validation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        answers = serializer.validated_data['answers']
        quiz = attempt.quiz
        questions = quiz.questions.all()

        logger.info(f"Traitement de {len(questions)} questions")

        correct_count = 0
        results = {}

        for question in questions:
            question_id = str(question.id)
            user_answer = answers.get(question_id, '')
            is_correct = user_answer == question.correct_answer

            if is_correct:
                correct_count += 1

            results[question_id] = {
                'user_answer': user_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct
            }

        score = (correct_count / len(questions)) * 100 if questions else 0

        logger.info(f"Score calculé: {score}% ({correct_count}/{len(questions)})")

        attempt.answers = results
        attempt.score = score
        attempt.completed_at = timezone.now()
        attempt.save()

        logger.info(f"✅ Tentative {pk} sauvegardée avec succès")

        return Response({
            'score': score,
            'correct_count': correct_count,
            'total_questions': len(questions),
            'results': results,
            'answers': results  # Pour compatibilité avec Results.jsx
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    user = request.user
    attempts = Attempt.objects.filter(user=user, completed_at__isnull=False)

    total_attempts = attempts.count()
    avg_score = sum(a.score for a in attempts) / total_attempts if total_attempts > 0 else 0

    quiz_stats = {}
    for attempt in attempts:
        quiz_id = attempt.quiz.id
        if quiz_id not in quiz_stats:
            quiz_stats[quiz_id] = {
                'quiz_title': attempt.quiz.title,
                'attempts': 0,
                'best_score': 0,
                'avg_score': 0,
                'scores': []
            }
        quiz_stats[quiz_id]['attempts'] += 1
        quiz_stats[quiz_id]['scores'].append(attempt.score)
        quiz_stats[quiz_id]['best_score'] = max(quiz_stats[quiz_id]['best_score'], attempt.score)

    for quiz_id in quiz_stats:
        scores = quiz_stats[quiz_id]['scores']
        quiz_stats[quiz_id]['avg_score'] = sum(scores) / len(scores) if scores else 0
        del quiz_stats[quiz_id]['scores']

    return Response({
        'total_attempts': total_attempts,
        'average_score': avg_score,
        'quiz_stats': list(quiz_stats.values())
    })