from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer

# ----------------------------
# Admin Login
# ----------------------------
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        if getattr(user, 'is_admin', False):
            login(request, user)
            request.session.save()
            return Response({
                'message': 'Admin login successful',
                'user': UserSerializer(user, context={'request': request}).data
            })
        return Response({'error': 'Not an admin user'}, status=status.HTTP_403_FORBIDDEN)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------
# User Login
# ----------------------------
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        if not getattr(user, 'is_admin', False):
            login(request, user)
            request.session.save()
            return Response({
                'message': 'User login successful',
                'user': UserSerializer(user, context={'request': request}).data
            })
        return Response({'error': 'Admin users should use admin login'}, status=status.HTTP_403_FORBIDDEN)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------
# Logout
# ----------------------------
@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

# ----------------------------
# Register Employee (Admin Only)
# ----------------------------
@csrf_exempt
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def register_employee(request):
    if not request.user.is_authenticated or not getattr(request.user, 'is_admin', False):
        return Response({'error': 'Only admin can register employees'}, status=status.HTTP_403_FORBIDDEN)
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Employee registered successfully',
            'user': UserSerializer(user, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------
# Get All Employees (Admin Only)
# ----------------------------
@api_view(['GET'])
def get_employees(request):
    if not request.user.is_authenticated or not getattr(request.user, 'is_admin', False):
        return Response({'error': 'Only admin can view employees'}, status=status.HTTP_403_FORBIDDEN)
    employees = CustomUser.objects.filter(is_admin=False)
    serializer = UserSerializer(employees, many=True, context={'request': request})
    return Response(serializer.data)

# ----------------------------
# Update Employee Permissions (Admin Only)
# ----------------------------
@api_view(['PUT'])
def update_employee_permissions(request, user_id):
    if not request.user.is_authenticated or not getattr(request.user, 'is_admin', False):
        return Response({'error': 'Only admin can update permissions'}, status=status.HTTP_403_FORBIDDEN)
    try:
        employee = CustomUser.objects.get(id=user_id, is_admin=False)
        employee.is_active_permission = request.data.get('is_active_permission', employee.is_active_permission)
        employee.save()
        return Response({
            'message': 'Permissions updated successfully',
            'user': UserSerializer(employee, context={'request': request}).data
        })
    except CustomUser.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

# ----------------------------
# Get Current User
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    return Response(UserSerializer(request.user, context={'request': request}).data)

# ----------------------------
# Update Profile
# ----------------------------
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_profile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile updated successfully', 'user': serializer.data})
    return Response(serializer.errors, status=400)

# ----------------------------
# Debug User Status (Optional)
# ----------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def debug_user_status(request):
    return Response({
        'user_authenticated': request.user.is_authenticated,
        'user_id': request.user.id if request.user.is_authenticated else None,
        'username': request.user.username if request.user.is_authenticated else 'Anonymous',
        'is_admin': getattr(request.user, 'is_admin', False) if request.user.is_authenticated else False,
        'is_active': request.user.is_active if request.user.is_authenticated else False,
        'session_key': request.session.session_key,
        'session_data': dict(request.session) if request.session.session_key else {}
    })

# ----------------------------
# Test API (Optional)
# ----------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def test_api(request):
    return Response({
        'message': 'API is working!',
        'user_authenticated': request.user.is_authenticated,
        'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
        'session_key': request.session.session_key
    })
