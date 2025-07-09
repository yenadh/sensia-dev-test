import secrets
import string
import random
import uuid

from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import render
from django.contrib.auth.models import User
from .models import UserTypes, UserPageAccess,Page, EmailOTP, Comment
from .serializer import UserTypesSerializer, UserSerializer, PageSerializer, UserPageAccessSerializer, CommentSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

User = get_user_model()

def generate_random_password(length=12):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_otp():
    return str(random.randint(100000, 999999))


############################ login ############################
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Validate user credentials using serializer
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user

            # Get the token pair from the parent class
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')

            # Prepare response object
            res = Response()

            # Add user info to the response
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            }

            res.data = {
                'success': True,
                'user': user_data,
            }

            # Set HttpOnly cookies
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

############################ token refresh ############################
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})

############################ logout ############################
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    print(request)
    try:
        res = Response()
        print(res)
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except Exception as e:
        print(e)
        return Response({'success':False})
    



############################ check authenticated ############################
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user, many=False)
    return Response({'authenticated':True})

############################ Email verification ############################
@api_view(['POST'])
@permission_classes([AllowAny])
def send_verification_email(request):
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email, is_active=True)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    otp = generate_otp()
    expires = timezone.now() + timedelta(minutes=30)

    EmailOTP.objects.update_or_create(
        user=user,
        defaults={'otp': otp, 'expires_at': expires}
    )

    verification_url = f"http://localhost:5173/verify?email={email}"
    send_mail(
        subject="Your OTP Code",
        message=(
            f"Your OTP for email verification is: {otp}\n\n"
            f"Click the link below to verify your email:\n"
            f"{verification_url}"
                ),
            from_email="your-email@gmail.com",
            recipient_list=[email],
            )

    return Response({'detail': 'OTP sent to email'})

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    print(request)
    email = request.data.get('email')
    input_otp = request.data.get('input_otp')

    try:
        user = User.objects.get(email=email, is_active=True)
        otp_record = EmailOTP.objects.get(user=user)
        print(otp_record)
    except (User.DoesNotExist, EmailOTP.DoesNotExist):
        return Response({'detail': 'Invalid request'}, status=400)

    if otp_record.otp == input_otp and otp_record.is_valid():
        token = uuid.uuid4()
        otp_record.one_time_token = token
        otp_record.save()

        return Response({'verified': True, 'token': str(token)})

    return Response({'verified': False, 'detail': 'Invalid or expired OTP'}, status=400)


############################ reset password ############################

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    print(request.data)
    token = request.data.get('token')
    new_password = request.data.get('password')

    try:
        otp_record = EmailOTP.objects.get(one_time_token=token)
        print(otp_record)
        if not otp_record.is_valid():
            print('token expired')
            return Response({'detail': 'Token expired'}, status=400)
        

        user = otp_record.user
        user.set_password(new_password)
        user.save()

        # Clean up the token
        otp_record.delete()

        return Response({'detail': 'Password reset successful'})

    except EmailOTP.DoesNotExist:
        return Response({'detail': 'Invalid token'}, status=400)



############################ get and create user types ############################
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_types(request):
    if request.method == 'GET':
        user = request.user
        user_type = UserTypes.objects.filter(created_by=user)
        serializer = UserTypesSerializer(user_type, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserTypesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


############################ Create users ############################
def is_super_admin(user):
    return user.is_authenticated and user.is_superuser

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def users(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Forbidden'}, status=403)

    if request.method == 'GET':
        users = User.objects.filter(is_active=True)
        users = users.order_by('-id')
        serializer = UserSerializer(users, many=True)
        
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')
            password = request.data.get('password') or generate_random_password()

            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_staff=serializer.validated_data.get('is_staff', False)
            )

            # Generate OTP and expiration
            otp = generate_otp()
            expires = timezone.now() + timedelta(minutes=10)

            EmailOTP.objects.update_or_create(
                user=user,
                defaults={'otp': otp, 'expires_at': expires}
            )

            # Send OTP Email with verification link
            verification_url = f"http://localhost:5173/verify?email={email}"
            send_mail(
                subject="Your OTP Code",
                message=(
                    f"Welcome {username}!\n\n"
                    f"Your OTP for email verification is: {otp}\n\n"
                    f"Click the link below to verify your email:\n"
                    f"{verification_url}"
                ),
                from_email="your-email@gmail.com",
                recipient_list=[email],
            )

            response_serializer = UserSerializer(user)
            return Response({
                'user': response_serializer.data,
                'generated_password': password
            }, status=201)

        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request , user_id):
        users = User.objects.filter(id=user_id)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    if not is_super_admin(request.user):
        return Response({'detail': 'Forbidden'}, status=403)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def soft_delete_user(request, user_id):
    if not is_super_admin(request.user):
        return Response({'detail': 'Forbidden'}, status=403)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

    user.is_active = False
    user.save()
    return Response({'detail': 'User soft-deleted (deactivated)'}, status=204)

############################ CRUD for pages ############################
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def pages(request):
    if request.method == 'GET':
        pages = Page.objects.all()
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


############################ Add/Update User Permissions on Pages ############################
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_user_page_permission(request):
    data = request.data
    user_id = data.get('user')
    page_id = data.get('page')

    if not user_id or not page_id:
        return Response({'detail': 'Both user and page parameters are required.'}, status=200)

    try:
        user = User.objects.get(id=user_id)
        page = Page.objects.get(id=page_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found', 'status': 'non'}, status=200)
    except Page.DoesNotExist:
        return Response({'detail': 'Page not found', 'status': 'non'}, status=200)

    try:
        access = UserPageAccess.objects.get(user=user, page=page)
        serializer = UserPageAccessSerializer(access)
        return Response({
            'status': 'true',
            'data': serializer.data
        }, status=200)
    except UserPageAccess.DoesNotExist:
        return Response({'detail': 'Permission record not found.', 'status': 'non'}, status=200)



@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def assign_page_permission(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Only admins can assign permissions.'}, status=403)

    data = request.data
    user_id = data.get('user')
    page_id = data.get('page')

    try:
        user = User.objects.get(id=user_id)
        page = Page.objects.get(id=page_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
    except Page.DoesNotExist:
        return Response({'detail': 'Page not found'}, status=404)

    obj, created = UserPageAccess.objects.update_or_create(
        user=user,
        page=page,
        defaults={
            'can_create': data.get('can_create', False),
            'can_edit': data.get('can_edit', False),
            'can_delete': data.get('can_delete', False),
            'can_comment': data.get('can_comment', False),
            'granted_by': request.user
        }
    )
    serializer = UserPageAccessSerializer(obj)
    return Response(serializer.data)

############################ View All Access Info (Admin Only) ############################
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_access(request):
    if not request.user.is_superuser:
        return Response({'detail': 'Only admins can view access list.'}, status=403)

    access = UserPageAccess.objects.select_related('user', 'page').all()
    serializer = UserPageAccessSerializer(access, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_access(request):
    user = request.user

    if not user.is_superuser:
        access = UserPageAccess.objects.select_related('user', 'page').filter(user=user)
        serializer = UserPageAccessSerializer(access, many=True)
        return Response({'admin': False, 'data': serializer.data})
    else:
        access = UserPageAccess.objects.select_related('user', 'page').filter(user=user)
        serializer = UserPageAccessSerializer(access, many=True)
        return Response({'admin': True, 'data': serializer.data})


############################ Comment  ############################
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):
    data = request.data
    page_id = data.get('page')
    content = data.get('content')

    try:
        page = Page.objects.get(id=page_id)
    except Page.DoesNotExist:
        return Response({'detail': 'Page not found'}, status=404)

    comment = Comment.objects.create(
        page=page,
        user=request.user,
        content=content
    )
    serializer = CommentSerializer(comment)
    return Response(serializer.data, status=201)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response({'detail': 'Comment not found'}, status=404)

    if comment.is_deleted():
        return Response({'detail': 'Cannot edit a deleted comment'}, status=400)

    comment.content = request.data.get('content')
    comment.edited_by = request.user
    comment.edited_at = timezone.now()
    comment.save()

    serializer = CommentSerializer(comment)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response({'detail': 'Comment not found'}, status=404)

    if comment.is_deleted():
        return Response({'detail': 'Comment already deleted'}, status=400)

    comment.deleted_by = request.user
    comment.deleted_at = timezone.now()
    comment.save()

    return Response({'detail': 'Comment soft-deleted'}, status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_comments(request):
    print(request)
    page_id = request.query_params.get('page_id')
    comments = Comment.objects.all()
    if page_id:
        comments = comments.filter(page_id=page_id)
    
    comments = comments.order_by('-id') 
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)
