import os

from BookProject.settings import *

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DEBUG = False
ALLOWED_HOSTS = os.environ['ALLOWED_HOSTS'].split(',')
CSRF_TRUSTED_ORIGINS=[f"https://{x}" for x in ALLOWED_HOSTS]
DOCKER_VOL_PATH='/mnt/storage'

STATIC_ROOT=f"{DOCKER_VOL_PATH}/static"
STATICFILES_STORAGE="whitenoise.storage.CompressedStaticFilesStorage"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': f"{DOCKER_VOL_PATH}/db/db.sqlite3",
    }
}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "/var/log/django.log"
        },

    },
    "root": {
        "handlers": ["console", "file"],
        "level": "DEBUG",
   },
}
