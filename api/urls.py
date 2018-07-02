# core django
from django.conf.urls import url, include

# project
from .views import task, sub_task
from .resources import TaskResource, SubTaskResource

# third party
from tastypie.api import Api
v1_api = Api(api_name='v1')
v1_api.register(TaskResource())
v1_api.register(SubTaskResource())

urlpatterns = [
    url(r'^tasks/$', task, name='task'),
    url(r'^sub-tasks/(?P<id>[0-9]+)/$', sub_task, name='sub-task'),
    url(r'^api/', include(v1_api.urls)),

]
