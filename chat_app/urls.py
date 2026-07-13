from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from . import views 

urlpatterns = [
    path('signup/', views.signup_view),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('current_user/',views.current_user),
    path("all_users/", views.get_all_users),

    # path('get_messages/', views.get_text),
    # path('send_text/', views.send_text),

    path('conversations/',views.get_my_conversations),

    path('conversations/create-personal/<int:user_id>/',views.create_personal_chat),

    path('conversations/send_direct_message/<uuid:conv_id>/',views.send_direct_message),
    path('conversations/get_direct_message/<uuid:conv_id>/',views.get_direct_message),

    path('notifications/<int:user_id>/',views.get_notifications)
]
