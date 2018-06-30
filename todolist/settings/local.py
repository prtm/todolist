from .base import *


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}