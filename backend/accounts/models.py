from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    name = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')], blank=True)
    mobile_number = models.CharField(max_length=15, blank=True)
    is_active_permission = models.BooleanField(default=True)
    
    
    def __str__(self):
        return self.username