import os

from BookProject.settings import *

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DEBUG = False
ALLOWED_HOSTS = os.environ['ALLOWED_HOSTS'].split(',')
CSRF_TRUSTED_ORIGINS=[f"https://{x}" for x in ALLOWED_HOSTS]

STATIC_ROOT="/mnt/docker-vol/static"
STATICFILES_STORAGE="whitenoise.storage.CompressedStaticFilesStorage"
