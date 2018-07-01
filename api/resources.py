# project
from .models import Task, SubTask

# third party
from tastypie.resources import ModelResource
from tastypie.constants import ALL


class TaskResource(ModelResource):
    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'


class SubTaskResource(ModelResource):
    class Meta:
        queryset = SubTask.objects.all()
        resource_name = 'sub-task'
