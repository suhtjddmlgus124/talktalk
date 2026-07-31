from .base import *


DEBUG = True

ALLOWED_HOSTS = [ os.environ.get('ALLOWED_HOST') ]

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