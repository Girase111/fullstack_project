from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api, name='test_api'),
    path('debug-user/', views.debug_user_status, name='debug_user_status'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('user/login/', views.user_login, name='user_login'),
    path('logout/', views.logout_view, name='logout'),
    path('register-employee/', views.register_employee, name='register_employee'),
    path('employees/', views.get_employees, name='get_employees'),
    path('employees/<int:user_id>/permissions/', views.update_employee_permissions, name='update_permissions'),
    path('current-user/', views.get_current_user, name='current_user'),
    path('update-profile/', views.update_profile, name='update_profile'),
]