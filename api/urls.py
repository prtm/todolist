from django.urls import path
from .views import task

urlpatterns = [
    path('home/', task ,name='task')
]
