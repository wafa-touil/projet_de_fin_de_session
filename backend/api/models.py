from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('teacher', 'Enseignant'),
        ('student', 'Étudiant'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def is_teacher(self):
        return self.role == 'teacher'
    
    def is_student(self):
        return self.role == 'student'

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

class Quiz(models.Model):
    DIFFICULTY_CHOICES = [
        ('facile', 'Facile'),
        ('difficile', 'Difficile'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    tags = models.CharField(max_length=200, blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='facile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Quiz"
        verbose_name_plural = "Quizs"

    def __str__(self):
        return self.title

class Question(models.Model):
    TYPE_CHOICES = [
        ('QCM', 'Choix Multiple'),
        ('VRAI_FAUX', 'Vrai ou Faux'),
    ]

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='QCM')
    question_text = models.TextField()
    options = models.JSONField(default=list)
    correct_answer = models.CharField(max_length=200)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Question"
        verbose_name_plural = "Questions"

    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"

class Attempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attempts', null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(default=0.0)
    answers = models.JSONField(default=dict)

    class Meta:
        ordering = ['-started_at']
        verbose_name = "Tentative"
        verbose_name_plural = "Tentatives"

    def __str__(self):
        return f"Attempt for {self.quiz.title} by {self.user.username if self.user else 'Anonymous'}"
