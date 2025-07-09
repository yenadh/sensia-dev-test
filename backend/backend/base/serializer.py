from rest_framework import serializers
from .models import UserTypes, Page, UserPageAccess, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class UserTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypes
        fields = ['id', 'user_type', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'is_staff']
        read_only_fields = ['id']


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'


class UserPageAccessSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    page_name = serializers.CharField(source='page.name', read_only=True)

    class Meta:
        model = UserPageAccess
        fields = [
            'id', 'user', 'username', 'page', 'page_name',
            'can_create', 'can_edit', 'can_delete', 'can_comment',
            'granted_by', 'updated_at'
        ]
        read_only_fields = ['granted_by', 'updated_at']


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    edited_by = serializers.StringRelatedField()
    deleted_by = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = '__all__'
