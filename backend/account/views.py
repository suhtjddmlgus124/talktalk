from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate, login, logout
from .serializers import LoginSerializer, RegisterSerializer, ProfileSerializer


class LoginView(APIView):
    permission_classes = [ AllowAny ]

    def post(self, request: Request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if not user:
            raise AuthenticationFailed(detail='아이디 혹은 비밀번호가 잘못되었습니다.')
        
        login(request, user)
        return Response({'detail': '로그인 되었습니다.'}, status.HTTP_200_OK)
    

class LogoutView(APIView):
    permission_classes = [ IsAuthenticated ]

    def post(self, request: Request):
        logout(request)
        return Response({'detail': '로그아웃 되었습니다.'}, status.HTTP_200_OK)
    

class RegisterView(APIView):
    permission_classes = [ AllowAny ]

    def post(self, request: Request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': '회원가입 되었습니다.'}, status.HTTP_201_CREATED)
    

class ProfileView(APIView):
    permission_classes = [ IsAuthenticated ]

    def get(self, request: Request):
        serializer = ProfileSerializer(request.profile)
        return Response(serializer.data, status.HTTP_200_OK)