from django.shortcuts import render
from .models import Task
# Create your views here.

def task(request):
    return render(request,'api/task.html',context={ "Tasks" : Task.objects.all() })