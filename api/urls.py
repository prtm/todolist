from django.urls import path
from .views import task

urlpatterns = [
    path('tasks/', task ,name='task')
]
