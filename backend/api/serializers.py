from rest_framework import serializers
from .models import User, Quiz, Question, Attempt

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']
    
    def create(self, validated_data):
        role = validated_data.get('role', 'student')
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role
        )
        return user


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_type', 'question_text', 'options', 'correct_answer', 'order']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    time_per_question = serializers.IntegerField(source='get_time_per_question', read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'creator', 'creator_username', 
                  'tags', 'difficulty', 'time_per_question', 'created_at', 
                  'updated_at', 'questions', 'question_count']
        read_only_fields = ['creator']
    
    def get_question_count(self, obj):
        return obj.questions.count()


class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'tags', 'difficulty', 'questions']
    
    def validate_questions(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Un quiz doit avoir au moins 5 questions.")
        if len(value) > 20:
            raise serializers.ValidationError("Un quiz ne peut pas avoir plus de 20 questions.")
        return value
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz.objects.create(**validated_data)
        
        for idx, question_data in enumerate(questions_data):
            Question.objects.create(quiz=quiz, order=idx, **question_data)
        
        return quiz


class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    user_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Attempt
        fields = ['id', 'quiz', 'quiz_title', 'user', 'user_username', 
                  'started_at', 'completed_at', 'score', 'answers']
        read_only_fields = ['user', 'started_at']
    
    def get_user_username(self, obj):
        return obj.user.username if obj.user else "Anonyme"


class AttemptCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ['id', 'quiz']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        return Attempt.objects.create(**validated_data)


class AttemptSubmitSerializer(serializers.Serializer):
    answers = serializers.JSONField()
    
    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Les réponses doivent être un dictionnaire.")
        return value

