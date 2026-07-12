"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from chat_app.middleware import JWTAuthMiddleware
from django.core.asgi import get_asgi_application

import chat_app.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket": JWTAuthMiddleware(URLRouter(
        chat_app.routing.websocket_urlpatterns
    ))
})

