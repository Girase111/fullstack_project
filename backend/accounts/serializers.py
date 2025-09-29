from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'name', 'address', 'profile_photo', 
                 'gender', 'mobile_number', 'is_active_permission']
    
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.is_admin = False  # Ensure registered employees are not admin
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                else:
                    raise serializers.ValidationError('User account is disabled')
            else:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Both username and password required')

class UserSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'address', 'profile_photo', 'profile_photo_url',
                 'gender', 'mobile_number', 'is_active_permission', 'is_admin', 'date_joined']
        read_only_fields = ['id', 'is_admin', 'date_joined']
    
    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return self.context['request'].build_absolute_uri(obj.profile_photo.url) if 'request' in self.context else obj.profile_photo.url
        return None