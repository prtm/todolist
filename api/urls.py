# core django
from django.urls import path, include

# project
from .views import task
from .resources import TaskResource, SubTaskResource

# third party
from tastypie.api import Api
v1_api = Api(api_name='v1')
v1_api.register(TaskResource())
v1_api.register(SubTaskResource())

urlpatterns = [
    path('tasks/', task ,name='task'),
    path('api/', include(v1_api.urls)),

]
