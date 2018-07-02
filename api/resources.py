# project
from .models import Task, SubTask

# third party
from tastypie.resources import ModelResource
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.authorization import DjangoAuthorization
from tastypie import fields

# tastypie task resource
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

# tastypie sub task resource
class SubTaskResource(ModelResource):
    parent_task = fields.ForeignKey(TaskResource, attribute='parent_task',full=True)
    class Meta:
        queryset = SubTask.objects.all()
        resource_name = 'sub-task'
        authorization = DjangoAuthorization()
        filtering = {
            'is_deleted' : ALL,
            'parent_task' : ALL_WITH_RELATIONS
        }
        excludes = ('created','modified')
