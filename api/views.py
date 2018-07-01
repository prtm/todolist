from django.shortcuts import render
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from .models import Task
# Create your views here.


def task(request):

    task_list = Task.manager.not_trashed()
    print(task_list)
    paginator = Paginator(task_list, 20)  # Show 20 tasks per page
    page = request.GET.get('page')
    try:
        tasks = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer deliver the first page
        tasks = paginator.page(1)
    except EmptyPage:
        # If page is out of range deliver last page of results
        tasks = paginator.page(paginator.num_pages)

    return render(request, 'api/task.html', {'page': page, 'Tasks': tasks})
