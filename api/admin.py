# core django
from django.contrib import admin

# project
from .models import Task, SubTask
# Register your models here.
admin.site.register(Task)
admin.site.register(SubTask)
