from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import transaction
from .models import User, Profile


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True, validators=[
        UniqueValidator(queryset=User.objects.all(), message='이미 사용 중인 아이디입니다.'),
    ])
    password = serializers.CharField(write_only=True)
    nickname = serializers.CharField(validators=[
        UniqueValidator(queryset=Profile.objects.all(), message='이미 사용 중인 닉네임입니다.'),
    ])

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
        )
        profile = Profile.objects.create(
            user=user,
            nickname=validated_data['nickname'],
        )
        return profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'nickname']
        read_only_fields = ['user']