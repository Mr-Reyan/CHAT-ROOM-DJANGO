from django.urls import path
from . import views 
urlpatterns = [
    path('send_text/',views.send_text),
    path('get_messages/',views.get_text)
]
