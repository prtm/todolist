# project
from .models import Task, SubTask

# third party
from tastypie.resources import ModelResource
from tastypie.constants import ALL
from tastypie.authorization import DjangoAuthorization


class TaskResource(ModelResource):
    class Meta:
        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = DjangoAuthorization()
        filtering = {
            'is_deleted' : ALL
        }
        excludes = ('created','modified')

    def dehydrate(self, bundle):
        bundle.data['has_sub_tasks'] = bundle.obj.has_sub_tasks
        return bundle

class SubTaskResource(ModelResource):
    class Meta:
        queryset = SubTask.objects.all()
        resource_name = 'sub-task'
        authorization = DjangoAuthorization()
