from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'name', 'is_admin', 'is_active_permission']
    list_filter = ['is_admin', 'is_active_permission', 'gender']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('is_admin', 'name', 'address', 'profile_photo', 'gender', 'mobile_number', 'is_active_permission')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {
            'fields': ('is_admin', 'name', 'address', 'profile_photo', 'gender', 'mobile_number', 'is_active_permission')
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)