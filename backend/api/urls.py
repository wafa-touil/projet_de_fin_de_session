from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register, QuizViewSet, QuestionViewSet, 
    AttemptViewSet, user_stats, CustomAuthToken
)


router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'attempts', AttemptViewSet, basename='attempt')

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', CustomAuthToken.as_view(), name='api_login'),  # Vue personnalisée login JWT
    path('stats/', user_stats, name='user_stats'),
    path('', include(router.urls)),
]
