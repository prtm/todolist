from .models import Task, SubTask

def remove_old_task():
    Task.manager.old.all().delete()
    SubTask.manager.old.all().delete()