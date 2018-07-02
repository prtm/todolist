# core django
from django.conf.urls import url, include
from django.core.paginator import Paginator, InvalidPage
from django.http import Http404
from haystack.query import SearchQuerySet
from haystack.inputs import Clean, AutoQuery

# project
from .models import Task, SubTask

# third party
from tastypie.utils import trailing_slash
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
            'is_deleted': ALL,
            'due_date': ['exact', 'range', 'gte']
        }
        excludes = ('created', 'modified')

    def dehydrate(self, bundle):
        bundle.data['has_sub_tasks'] = bundle.obj.has_sub_tasks
        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" % (self._meta.resource_name,
                                                       trailing_slash()), self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        sqs = SearchQuerySet().models(Task).load_all().auto_query(request.GET.get('q', ''))

        # if request.GET['is_deleted']:
        #     sqs = sqs.filter(is_deleted=Clean(request.GET['is_deleted']))
        #     print("is_deleted present")

        paginator = self._meta.paginator_class(request.GET, sqs,
                                               resource_uri=self.get_resource_uri(), limit=self._meta.limit,
                                               max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)

        to_be_serialized = paginator.page()

        bundles = [self.build_bundle(obj=result.object, request=request)
                   for result in to_be_serialized['objects']]
        to_be_serialized['objects'] = [
            self.full_dehydrate(bundle) for bundle in bundles]
        to_be_serialized = self.alter_list_data_to_serialize(
            request, to_be_serialized)
        return self.create_response(request, to_be_serialized)

# tastypie sub task resource


class SubTaskResource(ModelResource):
    parent_task = fields.ForeignKey(
        TaskResource, attribute='parent_task', full=True)

    class Meta:
        queryset = SubTask.objects.all()
        resource_name = 'sub-task'
        authorization = DjangoAuthorization()
        filtering = {
            'is_deleted': ALL,
            'parent_task': ALL_WITH_RELATIONS,
            'due_date': ['exact', 'range', 'gte']
        }
        excludes = ('created', 'modified')

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/search%s$" % (self._meta.resource_name,
                                                       trailing_slash()), self.wrap_view('get_search'), name="api_get_search"),
        ]

    def get_search(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)

        # Do the query.
        sqs = SearchQuerySet().models(Task).load_all().auto_query(request.GET.get('q', ''))
        # sqs = SearchQuerySet().models(Task).filter(title=).auto_query(request.GET.get('q', ''))

        # if request.GET['is_deleted']:
        #     sqs = sqs.filter(is_deleted=Clean(request.GET['is_deleted']))
        #     print("is_deleted present")

        paginator = self._meta.paginator_class(request.GET, sqs,
                                               resource_uri=self.get_resource_uri(), limit=self._meta.limit,
                                               max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)

        to_be_serialized = paginator.page()

        bundles = [self.build_bundle(obj=result.object, request=request)
                   for result in to_be_serialized['objects']]
        to_be_serialized['objects'] = [
            self.full_dehydrate(bundle) for bundle in bundles]
        to_be_serialized = self.alter_list_data_to_serialize(
            request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
