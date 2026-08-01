"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from dotenv import load_dotenv
load_dotenv()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

django_asgi_app = ASGIStaticFilesHandler(get_asgi_application())

from chatting.consumers import MessageConsumer

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path('ws/chatting/message/', MessageConsumer.as_asgi())
            ])
        )
    ),
})