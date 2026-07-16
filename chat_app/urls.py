from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from . import views 
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('signup/', views.signup_view),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),

    path('current_user/',views.current_user),
    path("all_users/", views.get_all_users),

    path('conversations/',views.get_my_conversations),
    path('conversations/get_groups/',views.get_my_groups),
    path('conversations/get_current/',views.get_current_conv),

    path('conversations/create-personal/<int:user_id>/',views.create_personal_chat),
    path('conversations/create_group_chat/',views.create_group_chat),

    path('conversations/get_direct_message/<uuid:conv_id>/',views.get_direct_message),

    path('notifications/<int:user_id>/',views.get_notifications),

    path('notifications/mark_as_read/<int:message_id>/',views.mark_as_read),
    # path('notifications/mark_as_unread/<int:notif_id>/',views.mark_as_unread),


    path('chat/<uuid:conv_id>/send/',views.send_direct_message),
    path('chat/<uuid:conv_id>/pdf/',views.generate_chat),
    path('chat/export/<int:export_id>/pdf/',views.download_chat),

    path('password_reset/',views.pass_reset),
    path('password_reset_confirm/',views.password_reset_confirm),

]
