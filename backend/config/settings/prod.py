from .base import *


DEBUG = (os.environ.get('DEBUG') == 'true')
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = [ os.environ.get('ALLOWED_HOST') ]

SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 0

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}

STATIC_ROOT = os.environ.get('STATIC_ROOT')
MEDIA_ROOT = os.environ.get('MEDIA_ROOT')

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(os.environ.get('REDIS_HOST'), int(os.environ.get('REDIS_PORT')))],
        }
    }
}

USE_X_ACCEL_REDIRECT = True